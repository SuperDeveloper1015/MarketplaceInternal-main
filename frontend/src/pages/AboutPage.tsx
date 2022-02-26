import React from 'react';

const AboutPage = () => {
    return (
        <main className="main">
            <section className="about-section">
                <div className="container-small">
                    <div className="typography">
                        <div>
                            <h2>Crypto for Creative Communities</h2>
                            <p>NFTs—non-fungible tokens—are empowering artists, musicians, and all kinds of
                                genre-defying digital creators to invent a new cultural paradigm. How this emerging
                                culture of digital art ownership looks is up to all of us.</p>
                            <p>Foundation bridges crypto and culture to create mutual support between artists and
                                collectors. We’re forging a community-driven path, providing culturally pioneering
                                curation, and sharing our tools with the rapidly evolving community of developers who
                                are excited to define this future with us. We want anyone and everyone who cares about
                                the future of digital expression to be a part of it.</p>
                            <p>Let’s explore these new possibilities collectively. </p>
                        </div>
                        <div>
                            <h2>Making History</h2>
                            <p>Since launching in February 2021, creators have directly earned over $40M in NFT sales on
                                Foundation overall, and over 425 artists have earned more than $12,000. You might have
                                heard about us through the hugely successful sale of the viral internet meme Nyan Cat,
                                or the more recent record sale of Pak’s Finite. We’ve supported thousands of other
                                artists, including Nadya Tolokonnikova of Pussy Riot, Shawna X, Yung Jake, Aphex Twin,
                                Zach Lieberman, Kim Laughton, Sarah Zucker, Devendra Banhart, Viktoria Modesta, Serwah
                                Attafuah, Edward Snowden, and Dom Hofmann, the cofounder of Vine. </p>
                            <p>Real-time updates on our fast-growing market live in the Foundation terminal.</p>
                        </div>
                        <img src={require('../images/about-img.jpg')} alt="photo"/>
                        <div>
                            <h2>How It Works</h2>
                            <h3>For Creators</h3>
                            <p>Creators are invited to join Foundation by members of the community. Once you’ve received
                                an invite, you’ll need to set up a MetaMask wallet with ETH before you can create an
                                artist profile and mint an NFT—which means uploading your JPG, PNG, or video file to
                                IPFS, a decentralized peer-to-peer storage network. It will then be an NFT you can price
                                in ETH and put up for auction on Foundation. </p>
                            <p>Creators receive 85% of the final sale price. If the piece is resold on Foundation (or
                                OpenSea and Rarible), a 10% royalty goes back to the wallet that originally minted the
                                NFT—in perpetuity.</p>
                            <p>Read the full guide: Get Started as a Creator</p>
                            <h3>For Collectors</h3>
                            <p>On Foundation, anyone can create a profile to start collecting NFTs. All you’ll need is a
                                MetaMask wallet and ETH, the cryptocurrency used to pay for all transactions on
                                Ethereum. Artists list NFTs for auction at a reserve price, and once the first bid is
                                placed, a 24-hour auction countdown begins. If a bid is placed within the last 15
                                minutes, the auction extends for another 15 minutes.</p>
                            <p>When you win an auction and claim the NFT, the artwork gets transferred to your wallet
                                and appears on your Foundation collector profile. You can also then display it in your
                                virtual gallery, share it on social media, sell it later on the secondary market, or
                                pioneer a new approach to appreciating digital art and championing the artists in your
                                collection.</p>
                            <p>Read the full guide: Get Started as a Collector</p>
                            <h3>For Developers</h3>
                            <p>We love collaborating, and invite developers to experiment with our free and open API or
                                share thoughts on our Discord.</p>
                            <h3>For the Community</h3>
                            <p>There are many ways to get involved with Foundation beyond joining as a creator,
                                collector, or developer. We welcome anyone interested in collectively building the
                                future of digital culture to join us on Discord, Instagram, or Twitter. There are a
                                number of community-led initiatives and events that you can plug into, participate in,
                                and even imagine new possibilities for. We actively encourage community members to
                                create new groups based around their interests.</p>
                            <p>Read our Community Guidelines</p>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    )
};

export default AboutPage;
