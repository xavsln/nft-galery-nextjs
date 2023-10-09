// Create dotenv to store ALchemy API key

"use client";

import { useState } from "react";

import { NftCard } from "./components/nftCard";

console.log("Test dotenv variables: ", process.env.NEXT_PUBLIC_TEST_DOTENV);

export default function Home() {
  // Create 2 variables to store wallet address and collection address
  const [wallet, setWalletAddress] = useState("");
  const [collection, setCollectionAddress] = useState("");

  // Create a variable to store NFT fetched using the Alchemy NFT API
  const [NFTs, setNFTs] = useState([]);

  // Create a variable to check whether whole collection should be fetched
  const [fetchForCollection, setFetchForCollection] = useState(false);

  // Create the fetch NFT function using Alchemy NFT API to get NFTs from a given address
  const fetchNFTS = async () => {
    alert("You clicked and entered this address : " + wallet + collection);
    let nfts;
    console.log("fetching nfts");
    const api_key = process.env.NEXT_PUBLIC_API_KEY;
    const baseURL = `https://eth-mainnet.g.alchemy.com/v2/${api_key}/getNFTs/`;
    var requestOptions = {
      method: "GET",
    };

    if (!collection.length) {
      const fetchURL = `${baseURL}?owner=${wallet}`;

      nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
    } else {
      console.log("fetching nfts for collection owned by address");
      const fetchURL = `${baseURL}?owner=${wallet}&contractAddresses%5B%5D=${collection}`;
      nfts = await fetch(fetchURL, requestOptions).then((data) => data.json());
    }

    if (nfts) {
      console.log("nfts:", nfts);
      setNFTs(nfts.ownedNfts);
    }
  };

  // Use Alchemy API getNFTsForCollection endpoint to get the NFTs from a given collection
  const fetchNFTsForCollection = async () => {
    if (collection.length) {
      var requestOptions = {
        method: "GET",
      };
      const api_key = process.env.NEXT_PUBLIC_API_KEY;
      const baseURL = `https://eth-mainnet.g.alchemy.com/v2/${api_key}/getNFTsForCollection/`;
      const fetchURL = `${baseURL}?contractAddress=${collection}&withMetadata=${"true"}`;
      const nfts = await fetch(fetchURL, requestOptions).then((data) =>
        data.json()
      );
      if (nfts) {
        console.log("NFTs in collection:", nfts);
        setNFTs(nfts.nfts);
      }
    }
  };

  return (
    <div className='flex flex-col items-center justify-center py-8 gap-y-3'>
      <div className='flex flex-col w-full justify-center items-center gap-y-2'>
        <input
          onChange={(e) => {
            setWalletAddress(e.target.value);
          }}
          value={wallet}
          type={"text"}
          placeholder='Add your wallet address'
        ></input>
        <input
          onChange={(e) => {
            setCollectionAddress(e.target.value);
          }}
          value={collection}
          type={"text"}
          placeholder='Add the collection address'
        ></input>
        <label className='text-gray-600 '>
          <input
            onChange={(e) => {
              setFetchForCollection(e.target.checked);
            }}
            type={"checkbox"}
            className='mr-2'
          ></input>
          Fetch for collection
        </label>
        <button
          className={
            "disabled:bg-slate-500 text-white bg-blue-400 px-4 py-2 mt-3 rounded-sm w-1/5"
          }
          onClick={() => {
            if (fetchForCollection) {
              fetchNFTsForCollection();
            } else fetchNFTS();
          }}
        >
          Let's go!{" "}
        </button>
      </div>
      <div className='flex flex-wrap gap-y-12 mt-4 w-5/6 gap-x-2 justify-center'>
        {NFTs.length &&
          NFTs.map((nft) => {
            return <NftCard nft={nft}></NftCard>;
          })}
      </div>
    </div>
  );
}
