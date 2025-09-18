import '../styles/index.css'

import Header from "./Header.tsx";
import Content from "./Content.tsx";
import Footer from "./Footer.tsx";

function App() {

  return (
    <div className={'App'}>
        <Header/>
        <Content></Content>
        <Footer></Footer>
    </div>
  )
}

export default App
