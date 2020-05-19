import React from 'react';
import socketIOClient from "socket.io-client";
import CardComponent from './CardComponent';
import ReplyBubbleComponent from './ReplyBubbleComponent';
import 'materialize-css/dist/css/materialize.min.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Row, Col, Form, Spinner } from 'react-bootstrap'
import { Scrollbars } from 'react-custom-scrollbars';

class HelpDesk extends React.Component {
  constructor(props) {
    super(props);
    this.state = { items: [], replies: [], loading: false, focusedTweet: null, replyTweet: ''};
  }

componentDidMount() {
  const socket = socketIOClient('http://localhost:3001/');

  socket.on('connect', () => {
    console.log("Socket Connected");
    socket.on("tweets", data => {
      console.info(data);
      let newList = [data].concat(this.state.items.slice(0, 100));
      this.setState({ items: newList });
    });
  });
  socket.on('disconnect', () => {
    socket.off("tweets")
    socket.removeAllListeners("tweets");
    console.log("Socket Disconnected");
  });
}

handleSubmit = async (event) => {
  event.preventDefault();
  let body = {
    tweetStrId: this.state.focusedTweet.id_str,
    screenName: this.state.focusedTweet.user.screen_name,
    msg: this.state.replyTweet
  }
  await fetch("/post-an-update", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:3001',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(body)
  })
  .then((res) => res.json())
  .then((res) => {
    console.log('Post a Tweet Backend Response: ' + res.response);
    this.setState({replyTweet: ''});
    let latestReplies = this.state.replies.concat(res.response);
    this.setState({ replies: latestReplies });
    console.log('Updated Tweet Replies');
  })
  .catch((err) => {
    console.log('Post a Tweet Error: ' + err);
    this.setState({replyTweet: ''});
  })
}

loadTweetData = async(tweetDetail) => {
  console.log('Tweet Details' + tweetDetail);
  this.setState({focusedTweet: tweetDetail, loading: true, replies:[]});
  let body = {
    tweetStrId: tweetDetail.id_str,
    screenName: tweetDetail.user.screen_name,
  }
  await fetch("/get-all-replies", {
    method: "POST",
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:3001',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(body)
  })
  .then((res) => res.json())
  .then((res) => {
    console.log('Load Tweet Replies Response: ' + res.response);
    this.setState({loading: false, replies: res.response});
  })
  .catch((err) => {
    console.log('Load Tweet Replies  Error: ' + err);
    this.setState({loading: false});
  })
}

renderRightCard = () => {
  if (this.state.focusedTweet) {
    if (this.state.replies.length > -1) {
      var replies = this.state.replies;
      var replyCards = 
        <div>
          { replies.reverse().map((x, i) =>
            <ReplyBubbleComponent key={i} data={x} />
          )}
        </div>;
    }  

    return (
      <Card style={{width: '55rem', height: '33rem', marginLeft: -18}}>
        <Row style={{height: '34rem', marginTop: 20}}>
            <Col md xl lg={7}>
              <Row style={{borderBottom: '1px solid', marginLeft: 2, alignItems: 'center', paddingBottom: 10, paddingLeft: 30, paddingTop: -20, borderColor: '#eee'}}>
                <img src={this.state.focusedTweet.user.profile_image_url} alt={this.state.focusedTweet.user.name} className="circle responsive-img" />
                <h6 style={{textOverflow: 'ellipsis', overflow: 'hidden', fontWeight: '800', marginLeft: 10}} className="black-text">{this.state.focusedTweet.user.name}</h6>
              </Row>
              <Row style={{height: '21rem'}}>
                  {
                    this.state.loading ?
                    <div style={{justifyContent: 'center', alignItems: 'center', marginLeft: '18rem', marginTop: '8rem'}}>
                      <Spinner variant="primary" size="lg" animation="grow" />
                    </div> :
                      <Scrollbars>
                        <ReplyBubbleComponent key={-1} data={this.state.focusedTweet} />
                        { replyCards }
                      </Scrollbars>
                  }
              </Row>
              <Row style={{borderTop: '1px solid', borderColor: '#eee', marginLeft: 2, padding: 5 }}>
                <Col>
                  <Form onSubmit={(e) => this.handleSubmit(e)} style={{marginLeft: 30, border: '0px solid', borderRadius: 5, borderColor: '#eee', height: '4rem', width: '90%'}}>
                    <Form.Group controlId="formBasicChat">
                      <Form.Control style={{border: '0px', alignItems: 'center'}} placeholder="Press Enter to Reply" value={this.state.replyTweet} onChange={(event) => this.setState({replyTweet: event.target.value})}/>
                    </Form.Group>
                  </Form>
                </Col>
                
              </Row>
            </Col>
            <Col style={{borderLeft:'1px solid', borderColor: '#eee'}} md lg={4}>
              <Row style={{ alignItems: 'center', justifyContent: 'center'}}>
                <img src={this.state.focusedTweet.user.profile_image_url} alt={this.state.focusedTweet.user.name} className="circle responsive-img" />
              </Row>
              <Row style={{ alignItems: 'center', justifyContent: 'center'}}> 
                <h6 style={{textOverflow: 'ellipsis', overflow: 'hidden', fontWeight: '800'}} className="black-text">{this.state.focusedTweet.user.name}</h6>
              </Row>
              <Row style={{ alignItems: 'center', justifyContent: 'center', marginTop: -20}}> 
                <h6 style={{textOverflow: 'ellipsis', overflow: 'hidden', fontWeight: '600'}} className="text-danger">@{this.state.focusedTweet.user.screen_name}</h6>
              </Row>
              <Row style={{ alignItems: 'center', justifyContent: 'center', marginTop: -20}}> 
                <a href={this.state.focusedTweet.user.url} style={{textOverflow: 'ellipsis', overflow: 'hidden', fontWeight: '600'}} className="text-primary">{this.state.focusedTweet.user.url}</a>
              </Row>
              <Row style={{ alignItems: 'center', justifyContent: 'center', marginTop: 30}}> 
                <h6 href={this.state.focusedTweet.user.url} style={{textOverflow: 'ellipsis', overflow: 'hidden', fontWeight: '600'}} className="text-secondary">Followers: {this.state.focusedTweet.user.followers_count}</h6>
              </Row>
              <Row style={{ alignItems: 'center', justifyContent: 'center', marginTop: -20}}> 
                <h6 href={this.state.focusedTweet.user.url} style={{textOverflow: 'ellipsis', overflow: 'hidden', fontWeight: '600'}} className="text-secondary">Friends: {this.state.focusedTweet.user.friends_count}</h6>
              </Row>
              <Row style={{ alignItems: 'center', justifyContent: 'center', marginTop: -20}}> 
                <h6 href={this.state.focusedTweet.user.url} style={{textOverflow: 'ellipsis', overflow: 'hidden', fontWeight: '600'}} className="text-secondary">Since: {new Date(this.state.focusedTweet.user.created_at).toDateString()}</h6>
              </Row>
            </Col>
        </Row>
    </Card>
    );
  } else {
    return(
      <Card style={{width: '55rem', height: '33rem', marginLeft: -18}} />
    )
  }
}
  render() {
    let items = this.state.items;
    let itemsCards =      
      <div>
        { items.map((x, i) =>
          <div key={i} onClick={() => {this.loadTweetData(x)}}>
            <CardComponent key={i} data={x} />
          </div>
        )}
      </div>

    let loading = 
        <Card style={{ width: '21rem', padding: 10 }}>
            <h5 style={{fontWeight: '400'}}>Waiting for Data ...</h5>
            <div className="progress light-blue lighten-5">
                <div className="indeterminate light-blue accent-2"></div>
            </div>
        </Card>

    return (
      <div>
        <div style={{marginTop: 10}} className="row">
            <div className="col s12 m4 l4">
                <Scrollbars>
                    <div className="col s12 offset-s6 m4 offset-m2 l4 offset-l2">
                        { items.length > 0 ? itemsCards : loading }
                    </div>
                </Scrollbars>
            </div>
            <div style={{}} className="col s12 m4 l4">
                {this.renderRightCard()}
            </div>
            <div style={{ flex: 1}} className="col s12 m4 l4">

            </div>
        </div>
      </div>
    );
  }
}


export default HelpDesk;