// //// Banner can render to other places

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




import {
  render,
  Text,
  BlockStack
} from '@shopify/checkout-ui-extensions-react';

// render('Checkout::Dynamic::Render', () => <App />);
render("Checkout::CartLineDetails::RenderAfter", () => <App />);

function App() {
  return (
    <BlockStack >
      <Text size="small">Item to dispatch DD/MM</Text>
      {/* <Text size="base">3 Total</Text> */}
      {/* <Text size="medium">Total</Text> */}
    </BlockStack>
  );
}





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
