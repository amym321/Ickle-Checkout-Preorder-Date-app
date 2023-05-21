
// import {
//   render,
//   Text,
//   BlockStack
// } from '@shopify/checkout-ui-extensions-react';

// // render('Checkout::Dynamic::Render', () => <App />);
// render("Checkout::CartLineDetails::RenderAfter", () => <App />);

// function App() {
//   return (
//     <BlockStack  >
//       <Text size="small"  >Item dispatched by <Text emphasis="italic">DD/MM</Text></Text>
//       {/* <Text size="base">3 Total</Text> */}
//       {/* <Text size="small">{{template}}</Text> */}
//     </BlockStack>
//   );
// }







// import {
//   render,
//   Text,
//   BlockStack
// } from '@shopify/checkout-ui-extensions-react';

// // render('Checkout::Dynamic::Render', () => <App />);
// render("Checkout::CartLineDetails::RenderAfter", () => <App />);

// function App() {
//   return (
//     <BlockStack  >
//       <Text size="small"  >Item dispatched by <Text emphasis="italic">DD/MM</Text></Text>
//       {/* <Text size="base">3 Total</Text> */}
//       {/* <Text size="small">{{template}}</Text> */}
//     </BlockStack>
//   );
// }





import React, { useEffect, useState } from "react";
import {
  render,
  Divider,
  Image,
  Banner,
  Heading,
  Button,
  InlineLayout,
  BlockStack,
  Text,
  SkeletonText,
  SkeletonImage,
  useCartLines,
  useApplyCartLinesChange,
  useExtensionApi,
} from "@shopify/checkout-ui-extensions-react";

// Set up the entry point for the extension
render("Checkout::Dynamic::Render", () => <App />);

// The function that will render the app
function App() {
  // Use `query` for fetching product data from the Storefront API, and use `i18n` to format
  // currencies, numbers, and translate strings
  const { query, i18n } = useExtensionApi();   /// useExtensionApi for accessing properties
  // Get a reference to the function that will apply changes to the cart lines from the imported hook
  const applyCartLinesChange = useApplyCartLinesChange();   /// an API. Performs an update on the merchandise line items
  // Set up the states
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [showError, setShowError] = useState(false);

  // On initial load, fetch the product variants
  useEffect(() => {
    // Set the loading state to show some UI if you're waiting
    setLoading(true);
    // Use `query` api method to send graphql queries to the Storefront API
    query(
      `query ($first: Int!) {
        products(first: $first) {
          nodes {
            id
            title
            images(first:1){
              nodes {
                url
              }
            }
            variants(first: 10) {
              nodes {
                id
                title
                price {
                  amount
                }
              }
            }
          }
        }
      }`,
      {
        variables: {first: 5},
      },
    )
    .then(({data}) => {
      // Set the `products` array so that you can reference the array items
      setProducts(data.products.nodes);
    })
    .catch((error) => console.error(error))
    .finally(() => setLoading(false));
  }, []);

  // If an offer is added and an error occurs, then show some error feedback using a banner
  useEffect(() => {
    if (showError) {
      const timer = setTimeout(() => setShowError(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showError]);

  // Access the current cart lines and subscribe to changes
  const lines = useCartLines();                                   /// *********

  // Show a loading UI if you're waiting for product variant data
  // Use Skeleton components to keep placement from shifting when content loads
  if (loading) {
    return (
      <BlockStack spacing="loose">
        <Divider />
        <Heading level={2}>You might also like</Heading>
        <BlockStack spacing="loose">
          <InlineLayout
            spacing="base"
            columns={[64, "fill", "auto"]}
            blockAlignment="center"
          >
            <SkeletonImage aspectRatio={1} />
            <BlockStack spacing="none">
              <SkeletonText inlineSize="large" />
              <SkeletonText inlineSize="small" />
            </BlockStack>
            <Button kind="secondary" disabled={true}>
              Add
            </Button>
          </InlineLayout>
        </BlockStack>
      </BlockStack>
    );
  }
  // If product variants can't be loaded, then show nothing
  if (!loading && products.length === 0) {
    return null;
  }

  // Get the IDs of all product variants in the cart
  const cartLineProductVariantIds = lines.map((item) => item.merchandise.id);
  // Filter out any products on offer that are already in the cart
  const productsOnOffer = products.filter(
    (product) => {
      const isProductVariantInCart = product.variants.nodes.some(
        ({id}) => cartLineProductVariantIds.includes(id)
      );
      return !isProductVariantInCart;
    }
  );

  // If all of the products are in the cart, then don't show the offer
  if (!productsOnOffer.length) {
    return null;
  }


  // Choose the first available product variant on offer
  // const { images, title, variants } = productsOnOffer[0];
  const { images, title, id, variants, productVariants } = productsOnOffer[0];
  // const { images, title, id, variants, metafields } = productsOnOffer[0];


  // Localize the currency for international merchants and customers
  const renderPrice = i18n.formatCurrency(variants.nodes[0].price.amount);

  // Use the first product image or a placeholder if the product has no images
  const imageUrl = images.nodes[0]?.url
    ?? "https://cdn.shopify.com/s/files/1/0533/2089/files/placeholder-images-image_medium.png?format=webp&v=1530129081";

  return (
    <BlockStack spacing="loose">
      <Divider />
      <Heading level={2}>You might also like</Heading>
      <BlockStack spacing="loose">
        <InlineLayout
          spacing="base"
          // Use the `columns` property to set the width of the columns
          // Image: column should be 64px wide
          // BlockStack: column, which contains the title and price, should "fill" all available space
          // Button: column should "auto" size based on the intrinsic width of the elements
          columns={[64, "fill", "auto"]}
          blockAlignment="center"
        >
          <Image
            border="base"
            borderWidth="base"
            borderRadius="loose"
            source={imageUrl}
            description={title}
            aspectRatio={1}
          />
          <BlockStack spacing="none">
            <Text size="medium" emphasis="strong">
              {title}
            </Text>
            <Text appearance="subdued">{renderPrice}</Text>
            {/* <Text appearance="subdued">{variants}</Text> */}
            <Text appearance="subdued">1 {variants[0]}</Text>
            <Text appearance="subdued">variant id =  {variants.nodes[0].id}</Text>          {/* has result */}
            <Text appearance="subdued">4 {variants.nodes[0].id.title}</Text>
            {/* <Text appearance="subdued">5 {variants.nodes[0].option[0]}</Text> */}
            {/* <Text appearance="subdued">5 {variants.nodes[0].option[1]}</Text> */}
            <Text appearance="subdued">5 {variants.nodes[0].option0}</Text>
            <Text appearance="subdued">6 {variants.nodes[0].option1}</Text>
            {/* <Text appearance="subdued">8 {variants.nodes[0].option.option0}</Text> */}
            {/* <Text appearance="subdued">9 {variants.nodes[0].option.option1}</Text> */}
            {/* <Text appearance="subdued">8 {variants.nodes[0].option.option[0]}</Text> */}
            {/* <Text appearance="subdued">9 {variants.nodes[0].option.option[1]}</Text> */}
            {/* <Text appearance="subdued"> {variant[0].option0}</Text> */}
            {/* <Text appearance="subdued"> {variant.option0}</Text> */}
            {/* <Text appearance="subdued"> {variants[0].option0}</Text> */}
            <Text appearance="subdued">7 {variants.option0}</Text>
            <Text appearance="subdued">8 {variants.option1}</Text>
            {/* <Text appearance="subdued">7 {variants[0].option0}</Text>
            <Text appearance="subdued">8 {variants[0].option1}</Text> */}
            {/* <Text appearance="subdued">{variants.option.option0}</Text> */}
            <Text appearance="subdued">x {variants.title}</Text>
            <Text appearance="subdued">9 {variants.nodes[0].title}</Text>
            {/* <Text appearance="subdued">x {variants.title[0]}</Text> */}
            {/* <Text appearance="subdued">x {variants[0].title}</Text> */}
            {/* <Text appearance="subdued">x {variants.title[0]}</Text> */}
            {/* <Text appearance="subdued">y {products.id}</Text> */}
            {/* <Text appearance="subdued">y {products.nodes[0].id}</Text> */}
            <Text appearance="subdued">y {title}</Text>
            <Text appearance="subdued">product id = {id}</Text>

          </BlockStack>
          <Button
            kind="secondary"
            loading={adding}
            accessibilityLabel={`Add ${title} to cart`}
            onPress={async () => {
              setAdding(true);
              // Apply the cart lines change
              const result = await applyCartLinesChange({
                type: "addCartLine",
                merchandiseId: variants.nodes[0].id,
                quantity: 1,
              });
              setAdding(false);
              if (result.type === "error") {
                // An error occurred adding the cart line
                // Verify that you're using a valid product variant ID
                // For example, 'gid://shopify/ProductVariant/123'
                setShowError(true);
                console.error(result.message);
              }
            }}
          >
            Add
          </Button>
        </InlineLayout>
      </BlockStack>
      {showError && (
        <Banner status="critical">
          There was an issue adding this product. Please try again.
        </Banner>
      )}
    </BlockStack>
  );
}




//// Banner can render to other places

// import React from "react";
// import {
//   render,
//   Text,
//   Banner,
//   useSettings,
// } from "@shopify/checkout-ui-extensions-react";

// // Set the entry points for the extension
// // render("Checkout::Dynamic::Render", () => <App />);
// render("Checkout::CartLineDetails::RenderAfter", () => <App />);
// // render("Checkout::DeliveryAddress::RenderBefore", () => <App />);
// // render("Checkout::CartLines::RenderAfter", () => <App />);
// // render("Checkout::CustomerInformation::RenderAfter", () => <App />);
// // render('Checkout::ShippingMethods::RenderAfter', () => <App />);

// function App() {
//   // Use the merchant-defined settings to retrieve the extension's content
//   const {title, description, collapsible, status: merchantStatus} = useSettings();

//   // Set a default status for the banner if a merchant didn't configure the banner in the checkout editor
//   const status = merchantStatus ?? 'info';

//   // Render the banner
//   return (
//     <Banner title={title} status={status} collapsible={collapsible}>
//       <Text size="base">A Total</Text>
//       {description}
//     </Banner>
//   );
// }






// // // Text line doesn't seem to render elsewhere

// import {render, Text, BlockStack, StyleHelper} from '@shopify/checkout-ui-extensions-react';

// // var templateVar = "{{template}}";

// // render('Checkout::Dynamic::Render', () => <App />);
// render('Checkout::ShippingMethods::RenderAfter', () => <App />);
// // render("Checkout::DeliveryAddress::RenderBefore", () => <App />);
// // render("Checkout::Deps::RenderBefore", () => <App />);

// function App() {
//   return (
//     <BlockStack inlineAlignment="center">
//       {/* <Text size="small">Total</Text> */}
//       <Text size="base">1 Total</Text>
//       {/* <Text size="base">{{cart.total_price}}</Text> */}
//       {/* <Text size="base">2 '{{template}}'</Text> */}
//       {/* <Text size="base">3 '{template}'</Text> */}
//       {/* <Text size="base">4 "{{template}}"</Text> */}
//       {/* <Text size="base">templateVar</Text> */}
//       {/* <Text size="base">'[template]'</Text> */}
//       {/* <Text size="base">{{cart.total_price}}</Text>
//       <Text size="base">{{cart.total_price}}</Text> */}
//     </BlockStack>
//   );
// }






// import {useExtensionApi, render, SkeletonText} from '@shopify/checkout-ui-extensions-react';

// render('Checkout::Dynamic::Render', () => <App />);

// function App() {
//   return (
//     <SkeletonText title="checkout-preorder-app-7.2">
//       {'test'};
//       {'metafield'};
//     </SkeletonText>
//   );
// }






// import React from 'react';
// import {
//   useExtensionApi,
//   render,
//   Banner,
//   useTranslate,
// } from '@shopify/checkout-ui-extensions-react';

// render('Checkout::Dynamic::Render', () => <App />);

// function App() {
//   const {extensionPoint} = useExtensionApi();
//   const translate = useTranslate();
//   return (
//     <Banner title="checkout-preorder-app-7.2">
//       {/* {translate('welcome', {extensionPoint})} */}
//       {translate('welcome', {extensionPoint})};
//       {'test'};
//     </Banner>
//   );
// }
