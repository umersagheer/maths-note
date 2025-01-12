import Home from "./screens/home";
import "./index.css";
import "@mantine/core/styles.css";
import { MantineProvider } from "@mantine/core";

function App() {
  return (
    <MantineProvider>
      <div className="dark">
        <Home />
      </div>
    </MantineProvider>
  );
}

export default App;
