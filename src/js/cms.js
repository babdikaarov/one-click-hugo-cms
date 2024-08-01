import CMS from "decap-cms-app";

// Import main site styles as a string to inject into the CMS preview pane
// eslint-disable-next-line import/no-unresolved
import styles from "!to-string-loader!css-loader!postcss-loader!sass-loader!../css/main.scss";

import HomePreview from "./cms-preview-templates/home";
import PostPreview from "./cms-preview-templates/post";
import ProductsPreview from "./cms-preview-templates/products";
import ValuesPreview from "./cms-preview-templates/values";
import ContactPreview from "./cms-preview-templates/contact";
import FooterPreview from "./cms-preview-templates/footer";

CMS.registerPreviewStyle(styles, { raw: true });
CMS.registerPreviewTemplate("home", HomePreview);
CMS.registerPreviewTemplate("post", PostPreview);
CMS.registerPreviewTemplate("products", ProductsPreview);
CMS.registerPreviewTemplate("values", ValuesPreview);
CMS.registerPreviewTemplate("contact", ContactPreview);
CMS.registerPreviewTemplate("footer", FooterPreview);
CMS.registerEventListener({
   name: "prePublish",
   handler: async ({ author, entry }) => {
      console.log("start 5 sec");

      // URL from the entry data (replace 'url' with the actual field name)
      const url = "https://kashkaldak.edu.kg";

      try {
         // Fetch the HTML content from the URL
         const response = await fetch(url);
         if (!response.ok) {
            throw new Error(`Failed to fetch HTML from ${url}`);
         }

         // Convert the response to text
         const html = await response.text();

         // Parse the HTML and extract Open Graph data
         const parser = new DOMParser();
         const doc = parser.parseFromString(html, "text/html");

         const ogData = {
            title: doc.querySelector('meta[property="og:title"]')?.content || "No title",
            description: doc.querySelector('meta[property="og:description"]')?.content || "No description",
            image: doc.querySelector('meta[property="og:image"]')?.content || "No image",
         };

         // Log the Open Graph data
         console.log("Open Graph Data:", JSON.stringify(ogData));

         // Log the entry data after fetching Open Graph data
         console.log(JSON.stringify({ author, data: entry.get("data") }));
      } catch (error) {
         console.error("Error:", error.message);
      }

      console.log("finish 5 sec");
   },
});
CMS.init();
