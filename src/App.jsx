import { BrowserRouter, Routes, Route } from "react-router-dom";
import SellosList from "../src/features/SellosView"; 
import SellosCards from "../src/features/SellosCat";
import { SnackbarProvider } from "../src/components/context/SnackbarProvider";
import Records from "../src/components/Catalogos/Records";
import Layout from "../src/components/Layout";

function App() {
  return (
    <SnackbarProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route path="sellos" element={<SellosList />} />
            <Route path="sellosCards" element={<SellosCards />} />
            <Route path="record" element={<Records />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </SnackbarProvider>
  );
}

export default App;
