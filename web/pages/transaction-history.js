import 'bootstrap/dist/css/bootstrap.css';
import { useEffect, useState } from 'react';
import { Col, Container, Row,Button, Card, Form, ListGroup } from 'react-bootstrap';
import Header from '../components/Header';
import contract from '../utils/contract/Marketplace.json';

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const abi = contract.abi;

const Web3 = require('web3');
const web3 = new Web3('ws://localhost:8545');

const nftContract = new web3.eth.Contract(abi,contractAddress);

export default function Detail() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [metamask, setMetamask] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const checkWalletIsConnected = async() =>{
    const {ethereum} = window;

    if(!ethereum){
      console.log('Metamask belum terinstall');
      setMetamask(false);
      return;
    }else{
      setMetamask(true);

      window.ethereum.on("accountChanged",(accounts) =>{
        window.location.reload();
      })
      window.ethereum.on("chainChanged",(accounts) =>{
        window.location.reload();
      })
    }

    const accounts = await ethereum.request({method:'eth_accounts'});

    if(accounts.length !== 0){
      const account = accounts[0];

      setCurrentAccount(account);

      await getTransaction(account);
    }else{
      console.log('Account tidak diberi otoritas');
    }
  };

  const connectWalletHandler = async() =>{
    const {ethereum} = window;

    if(!ethereum){
      console.log('Metamask belum terinstall');
      setMetamask(false);
      return;
    }else{
      setMetamask(true);

      window.ethereum.on("accountChanged",(accounts) =>{
        window.location.reload();
      })
      window.ethereum.on("chainChanged",(accounts) =>{
        window.location.reload();
      })
    }

    const accounts = await ethereum.request({method:'eth_requestAccounts'});

    if(accounts.length !== 0){
      const account = accounts[0];

      setCurrentAccount(account);

      await getTransaction(account);
    }else{
      console.log('Account tidak diberi otoritas');
    }
  };

  const getTransaction = async(account) => {
    const data = await nftContract.methods.getTransactionByAddress().call();

    setTransactions(data);
  }

  useEffect(() =>{
    checkWalletIsConnected();
  },[])

  const connectButton = () => (<Button variant='primary' className='w-100' onClick={connectWalletHandler}>Connect</Button>);

  return (
    <>
      <Header/>
      <Container className='h-100'>

        {
          currentAccount ? (
            <Col>
              <Card className='mt-5 p-5'>
                <div className='text-center mb-5'><h2>List History Transaction</h2></div>
                <Row className='gy-5'>
                    {
                      transactions.map((transaction, i) => 
                        <Col className='col-md-4'>
                          <Card style={{minHeight:"450px"}}>
                            <Card.Img variant="top" src={transaction.image} />
                            <Card.Body>
                              <Card.Title>{transaction.name}</Card.Title>
                              <Card.Text>
                                {transaction.description}<hr/>
                                <div className='mt-2'>Price : {Web3.utils.fromWei(transaction.price,'ether')} Eth</div>
                                <div> Qty : {transaction.qty}</div>
                              </Card.Text>
                            </Card.Body>
                            </Card>
                        </Col>
                      )
                    }
                </Row>
              </Card>
            </Col>
          ) : connectButton()
        }
      </Container>
    </>
  )
}
