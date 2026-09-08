import Topbar from './Topbar'
import BasicTabs from './BasicTabs' // 👈 Yahan se curly braces hata diye!

const Authbar = () => {
  return (
    <>
      <Topbar/>
      <BasicTabs/>
    </>  
  )
}

export default Authbar