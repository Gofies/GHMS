// import React, { createContext, useContext, useState, useEffect } from 'react';

// // Context oluştur
// const DarkModeContext = createContext();

// export const DarkModeProvider = ({ children }) => {
//   const [darkMode, setDarkMode] = useState(
//     localStorage.getItem("darkMode") === "true"
//   );

//   // Dark mode durumunu localStorage'de sakla
//   useEffect(() => {
//     if (darkMode) {
//       document.documentElement.classList.add("dark");
//       localStorage.setItem("darkMode", "true");
//     } else {
//       document.documentElement.classList.remove("dark");
//       localStorage.setItem("darkMode", "false");
//     }
//   }, [darkMode]);

//   return (
//     <DarkModeContext.Provider value={{ darkMode, setDarkMode }}>
//       {children}
//     </DarkModeContext.Provider>
//   );
// };

// // Context'i kolay erişim için özel bir hook ile sağlayın
// export const useDarkMode = () => useContext(DarkModeContext);
