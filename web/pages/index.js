import 'bootstrap/dist/css/bootstrap.css';
import { useEffect, useState } from 'react';
import { Col, Container, Row,Button, Card, Form, ListGroup } from 'react-bootstrap';
import Header from '../components/Header';
import contract from '../utils/contract/Marketplace.json';
import Link from 'next/link'

const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
const abi = contract.abi;

const Web3 = require('web3');
const web3 = new Web3('ws://localhost:8545');

const nftContract = new web3.eth.Contract(abi,contractAddress);

export default function Home() {
  const [currentAccount, setCurrentAccount] = useState(null);
  const [metamask, setMetamask] = useState(null);
  const [stores, setStores] = useState([]);

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

      await checkStore();
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

      await checkStore();
    }else{
      console.log('Account tidak diberi otoritas');
    }
  };

  const checkStore = async() => {
    const data = await nftContract.methods.getStore().call();

    setStores(data);
  }

  useEffect(() =>{
    checkWalletIsConnected();
  },[])

  const connectButton = () => (<Button variant='primary' className='w-100' onClick={connectWalletHandler}>Connect</Button>);
  
  return (
    <>
      <Header/>
      <Container className='h-100'>
        <Card className='mt-5 p-5'>
          <div className='text-center mb-5'><h2>List Store</h2></div>
          <Row>
              {
                stores.map((item, i) => 
                  <Col className='col-md-4'>
                  <Card>
                      <Card.Body>
                        <Card.Title>Store</Card.Title>
                        <Card.Text>{item}</Card.Text>

                        <Link href={`/store/${item}`}>
                          <Button variant="primary">Visit</Button>
                        </Link>
                      </Card.Body>
                    </Card>
                    </Col>
                  )
              }
          </Row>
        </Card>
        
      </Container>
    </>
  )
}
