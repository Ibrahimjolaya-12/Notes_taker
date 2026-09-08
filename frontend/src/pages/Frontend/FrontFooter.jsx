import { Col, Row } from "antd"

const FrontFooter = () => {
  return (
    <footer className="front-footer">
      <div className="container">
        <Row>
          <Col span={24} className="text-center mb-0">
            <p className="footer-text py-2">
              &copy; {new Date().getFullYear()} ClassNotes. All rights reserved.
            </p>
          </Col>
        </Row>
      </div>
    </footer>
  )
}

export default FrontFooter