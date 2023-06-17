// import React, { useState } from "react";
// import pdfParse from "pdf-parse";

// const MyComponent = () => {
//   const [abstract, setAbstract] = useState("");

//   const handleChange = async (event) => {
//     const file = event.target.files[0];

//     // Use pdfParse to extract the text content of the PDF file
//     const text = await pdfParse(file);

//     // Use a regular expression or other string manipulation techniques to extract the abstract from the text content
//     const abstractRegex = /Abstract:(.+)/;
//     const match = text.match(abstractRegex);
//     if (match) {
//       const abstract = match[1];
//       setAbstract(abstract);
//     }
//   };

//   return (
//     <div>
//       <input type="file" onChange={handleChange} accept="application/pdf" />
//       <textarea value={abstract} readOnly />
//     </div>
//   );
// };

// export default MyComponent;
