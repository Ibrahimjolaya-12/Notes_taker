import FrontCard from "./FrontCard"
import FrontendPage from "./FrontendPage"
import FrontFooter from "./FrontFooter"
import FrontNav from "./FrontNav"

const Frontend = () => {
  return (
    <div className="frontend-wrapper">
        <FrontNav/>
    <FrontendPage/>
    <FrontCard/>
    <FrontFooter/>
    </div>
  )
}

export default Frontend