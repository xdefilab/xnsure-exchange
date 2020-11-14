const { assert } = require("console");
const {advanceBlock} = require('./advanceBlock');

const Uniswap = artifacts.require('UniswapV2Router02');
const Factory = artifacts.require('UniswapV2Factory');
const TokenA = artifacts.require('MockTokenA');
const TokenB = artifacts.require('MockTokenB');
const Pair = artifacts.require('UniswapV2Pair');


contract('Uniswap', (accounts) => {
    
    before(async() => {
        this.uniswap = await Uniswap.deployed();
        this.tokenA = await TokenA.deployed();
        this.tokenB = await TokenB.deployed();
        this.factory = await Factory.at(await this.uniswap.factory()); 

        this.totalSupply = await web3.utils.toWei('1000000');
        this.currentBlockNumber = await web3.eth.getBlockNumber();
        this.deadline = this.currentBlockNumber + 100;
        console.log("block number： " + this.currentBlockNumber + " deadline: " + this.deadline);

        await this.tokenA.setExpirationBlockNumber(this.deadline);
        // await this.tokenB.setExpirationBlockNumber(this.deadline);

        await this.tokenA.mint(accounts[0], this.totalSupply);
        await this.tokenB.mint(accounts[0], this.totalSupply);
    })

    it("add liquidity", async () => {
        
        let balanceA = await this.tokenA.balanceOf(accounts[0])
        let balanceB = await this.tokenB.balanceOf(accounts[0])
        console.log("TokenA balance : " + balanceA + " TokenB balance: " + balanceB)
        
        let amountA = await web3.utils.toWei('100');
        let amountB = await web3.utils.toWei('1000');

        await this.tokenA.approve(this.uniswap.address, amountA);
        await this.tokenB.approve(this.uniswap.address, amountB);
        
        await this.uniswap.addLiquidity(
            this.tokenA.address,
            this.tokenB.address,
            amountA,
            amountB,
            0,
            0,
            accounts[0],
            1705330221
        );

        balanceA = await this.tokenA.balanceOf(accounts[0])
        balanceB = await this.tokenB.balanceOf(accounts[0])
        console.log("TokenA balance: " + balanceA + " TokenB balance: " + balanceB)        
    })

    it("swap before deadline", async () => {
        
        let currentBlockNumber = await web3.eth.getBlockNumber();
        console.log("current block number: " + currentBlockNumber);
        
        let balanceA = await this.tokenA.balanceOf(accounts[0])
        let balanceB = await this.tokenB.balanceOf(accounts[0])
        console.log("TokenA balance : " + balanceA + " TokenB balance: " + balanceB)
        
        let amountAIn = await web3.utils.toWei('10');
        await this.tokenA.approve(this.uniswap.address, amountAIn);

        await this.uniswap.swapExactTokensForTokens(
            amountAIn,
            0,
            [this.tokenA.address, this.tokenB.address],
            accounts[0],
            1705330221
        )

        balanceA = await this.tokenA.balanceOf(accounts[0])
        balanceB = await this.tokenB.balanceOf(accounts[0])
        console.log("TokenA balance : " + balanceA + " TokenB balance: " + balanceB)

    })

    
    it("advance block", async() => {
        
        let currentBlockNumber = await web3.eth.getBlockNumber();
        for (let i = currentBlockNumber; i <= this.deadline; i++) {
            await advanceBlock(this.deadline);
        }
        currentBlockNumber = await web3.eth.getBlockNumber();
        console.log("current block number: " + currentBlockNumber);
    })

    it("swap after deadline", async () => {

        let currentBlockNumber = await web3.eth.getBlockNumber();
        console.log("current block number: " + currentBlockNumber);
        
        let balanceA = await this.tokenA.balanceOf(accounts[0])
        let balanceB = await this.tokenB.balanceOf(accounts[0])
        console.log("TokenA balance : " + balanceA + " TokenB balance: " + balanceB)
        
        let amountAIn = await web3.utils.toWei('10');
        await this.tokenA.approve(this.uniswap.address, amountAIn);

        await this.uniswap.swapExactTokensForTokens(
            amountAIn,
            0,
            [this.tokenA.address, this.tokenB.address],
            accounts[0],
            1705330221
        )

        balanceA = await this.tokenA.balanceOf(accounts[0])
        balanceB = await this.tokenB.balanceOf(accounts[0])
        console.log("TokenA balance : " + balanceA + " TokenB balance: " + balanceB)

    })

    it("remove liquidity", async () => {
        let balanceA = await this.tokenA.balanceOf(accounts[0])
        let balanceB = await this.tokenB.balanceOf(accounts[0])
        console.log("TokenA balance : " + balanceA + " TokenB balance: " + balanceB)
        
        let pair = await Pair.at(await this.factory.getPair(this.tokenA.address, this.tokenB.address));
        let liquidity = await pair.balanceOf(accounts[0]);
        console.log("liquidity balance : " + liquidity)

        await pair.approve(this.uniswap.address, liquidity);
        
        await this.uniswap.removeLiquidity(
            this.tokenA.address,
            this.tokenB.address,
            liquidity.toString(),
            0,
            0,
            accounts[0],
            1705330221
        )

        balanceA = await this.tokenA.balanceOf(accounts[0])
        balanceB = await this.tokenB.balanceOf(accounts[0])
        console.log("TokenA balance: " + balanceA + " TokenB balance: " + balanceB)

        liquidity = await pair.balanceOf(accounts[0]);
        console.log("liquidity balance : " + liquidity)
    })

    // it("get init code", async () => {
    //     let result = await this.factory.INIT_CODE_PAIR_HASH();
    //     console.log(result);
    // })
    
});