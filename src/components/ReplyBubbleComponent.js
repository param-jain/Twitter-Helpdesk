import React from 'react';
import 'materialize-css/dist/css/materialize.min.css'
import { Col, Row } from 'react-bootstrap'

class ReplyBubbleComponent extends React.Component {
    render() {
        let data = this.props.data;

        return (
            <div border="#eee" style={{ width: '38rem', marginLeft: '2rem', paddingTop: 0, paddingRight: 0, paddingLeft: 10 }}>
                   <Row style={{borderBottom: '0px solid', paddingBottom: 10, color: '#eee'}}>
                        <Col md={1.2}>
                            <img src={data.user.profile_image_url} alt={data.user.name} className="circle responsive-img" />
                        </Col>
                        <Col md={10}>
                            <div style={{fontSize: 16, textOverflow: 'ellipsis', overflow: 'hidden', fontWeight: '600'}} className="black-text">{data.user.name}</div>
                            <div style={{fontSize: 12}} className="black-text">{data.text}</div>
                            <div style={{fontSize: 14, textOverflow: 'ellipsis', overflow: 'hidden', fontWeight: '400', color:'#666'}}>{new Date(data.created_at).toDateString()}</div>
                        </Col>
                        <Col md={1.8}>
                            <div style={{fontSize: 14, textOverflow: 'ellipsis', overflow: 'hidden', fontWeight: '400', color:'#666'}}>{new Date(data.created_at).getHours()}:{new Date(data.created_at).getMinutes()}</div>
                        </Col>
                    </Row>
            </div>
        );
    }
}

export default ReplyBubbleComponent;