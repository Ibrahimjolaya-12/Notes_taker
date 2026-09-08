    import {  Col, Row, Space } from "antd"
import { useNavigate } from "react-router-dom"

    const FrontendPage = () => {
        const navigate = useNavigate()
    return (
        <>
        <div className="container">
            <Row className="text-center">
                <Col span={24} className="d-flex align-items-center justify-content-center mb-3 text-center">
                <h1 style={{color:"#4A3EE2",fontWeight:"900",fontSize:"60px",width:"50vw",textAlign:"center",marginTop:"100px"}}>All your class notes, organized.</h1>
                </Col>
                <Col span={24}>
                <p style={{color:"#849DB8",fontSize:"18px"}}>Upload PDFs, slides, videos and text. Tag by chapter. Search instantly. Summarize with AI.</p>
                </Col>
                <Col span={24} className="py-4">
                <Space size={"large"}>
                    <button onClick={()=>{navigate("/auth/register")}} style={{backgroundColor:"#766FFF", color:"black", border:"none", padding:"10px 25px", fontWeight:"600"}} className="rounded-3">Get started free</button>
                    <button onClick={()=>{navigate("/auth/login")}} style={{backgroundColor:"#000", color:"white", border:"1px solid black", padding:"10px 25px", fontWeight:"600"}} className="rounded-3">I have an account</button>
                </Space>
                </Col>
            </Row>
        </div>
        </>
    )
    }

    export default FrontendPage