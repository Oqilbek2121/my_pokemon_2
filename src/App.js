import React from "react";
const LazyExampleComponent = React.lazy(() => import('./components/ExampleComponent'));

function App() {
  return (
    <>
      <LazyExampleComponent />
    </>
  );
}

export default App;
