import React from 'react';
import 'materialize-css/dist/css/materialize.min.css'
import { Col, Row } from 'react-bootstrap'

class ReplyBubbleComponent extends React.Component {
    render() {
        let data = this.props.data;

        return (
            <div border="#eee" style={{ width: '30rem', marginLeft: '2rem', paddingTop: 0, paddingRight: -10, paddingLeft: 10 }}>
                   <Row style={{borderBottom: '0px solid', paddingBottom: 10, color: '#eee'}}>
                        <Col md={2}>
                            <img src={data.user.profile_image_url} alt={data.user.name} className="circle responsive-img" />
                        </Col>
                        <Col md={8}>
                            <h6 style={{textOverflow: 'ellipsis', overflow: 'hidden', fontWeight: '600'}} className="black-text">{data.user.name}</h6>
                            <span className="black-text">{data.text}</span>
                            <h6 style={{textOverflow: 'ellipsis', overflow: 'hidden', fontWeight: '400', color:'#666'}}>{new Date(data.created_at).toDateString()}</h6>
                        </Col>
                        <Col md={2.5}>
                            <h6 style={{textOverflow: 'ellipsis', overflow: 'hidden', fontWeight: '400', color:'#666'}}>{new Date(data.created_at).getHours()}:{new Date(data.created_at).getMinutes()}</h6>
                        </Col>
                    </Row>
            </div>
        );
    }
}

export default ReplyBubbleComponent;