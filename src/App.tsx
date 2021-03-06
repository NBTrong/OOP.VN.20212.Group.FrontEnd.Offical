import React, { useEffect, useRef, useState } from "react";
import { Box } from "@mui/material";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";
import theme from "./styles/Theme";
import BottomNavigation from "./components/BottomNavigation";
import Insert from "./pages/Insert";
import { v4 as uuidv4 } from "uuid";
import List from "./pages/List";
import Report from "./pages/Report";
import WishList from "./pages/WishList";
import Update from "./pages/Update";

function App() {
  const [userKey, setUserKey] = useState<string>("");

  useEffect(() => {
    let _userKey = localStorage.getItem("userKey");
    if (!_userKey) {
      _userKey = uuidv4();
      localStorage.setItem("userKey", _userKey);
    }
    setUserKey(_userKey);
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <div className="All">
        <Box className="App" pt={"50px"} pb={"56px"}>
          <BrowserRouter>
            <Routes>
              <Route path="/insert" element={<Insert userKey={userKey} />} />
              <Route
                path="/update/:status/:id"
                element={<Update userKey={userKey} />}
              />
              <Route path="/list" element={<List userKey={userKey} />} />
              <Route path="/report" element={<Report userKey={userKey} />} />
              <Route
                path="/wish-list"
                element={<WishList userKey={userKey} />}
              />
            </Routes>
            <BottomNavigation />
          </BrowserRouter>
        </Box>
      </div>
    </ThemeProvider>
  );
}

export default App;
