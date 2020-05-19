import React from 'react';
import 'materialize-css/dist/css/materialize.min.css'
import { Card, Col, Row } from 'react-bootstrap'

class CardComponent extends React.Component {
     
    truncate = (str, len) => {
        return str.length > len ? str.substring(0, len-3) + "..." : str;
    }
    render() {
        let data = this.props.data;

        return (
            <Card border="#eee" style={{ width: '21rem', paddingTop: 10, paddingRight: -10, paddingLeft: 10 }}>
                    <Row>
                        <Col md={3}>
                            <img src={data.user.profile_image_url} alt={data.user.name} className="circle responsive-img" />
                        </Col>
                        <Col md={8}>
                            <h6 style={{textOverflow: 'ellipsis', overflow: 'hidden', fontWeight: '600'}} className="black-text">{this.truncate(data.user.name, 26)}</h6>
                            <span className="black-text">{this.truncate(data.text, 53)}</span>
                        </Col>
                    </Row>
            </Card>
        );
    }
}

export default CardComponent;