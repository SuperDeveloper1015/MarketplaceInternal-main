import React, { useEffect, useRef, useState } from 'react';
import { observer } from "mobx-react";
import { resolve, useInjection } from "inversify-react";
import { ModalStore, WalletStore } from "../stores";
import { ModalsEnum } from "../stores/ModalStore";
import { toast } from "react-toastify";
import _ from "lodash";
import Cards from "../components/Cards";
import { Swiper, SwiperSlide } from "swiper/react";
import CardsCreator from "../components/CardsCreator";
import { Api } from "../utils/api";
import { IndexPageType } from "../utils/graphql-gqlr";
import ArtworkCard from "../components/artwork/ArtworkCard";
import SliderArtwork from "../components/index/SliderArtwork";
import CreatorCard from "../components/index/CreatorCard";
import { Link } from 'react-router-dom';

interface IIndexPageProps {
}

interface IIndexPageState {
}

const IndexPage = observer(() => {
    const swiperPagination = useRef<HTMLDivElement>();

    const modalStore = useInjection(ModalStore);
    const walletStore = useInjection(WalletStore);
    const api = useInjection(Api);

    const [ indexPage, setIndexPage ] = useState<IndexPageType>();

    useEffect(() => {
        (async () => {
            setIndexPage(await api.getIndexPage());
        })();
    }, []);

    return (
        <main className="main">
            {indexPage?.topSlider.length > 0 && (
                <section className="slide-section">
                    <div className="container">
                        <div className="swiper-container base-slide">
                            <Swiper
                                spaceBetween={12}
                                slidesPerView='auto'
                                loop={false}
                                mousewheel={{ invert: true }}
                                pagination={{ el: '.swiper-pagination', clickable: true }}
                                breakpoints={{
                                    320: {
                                        slidesPerView: 1,
                                        spaceBetween: 20,
                                    },
                                    560: {
                                        slidesPerView: 1.5,
                                        spaceBetween: 15,
                                    },
                                    800: {
                                        slidesPerView: 2.5,
                                        spaceBetween: 12,
                                    }
                                }}
                            >
                                {indexPage.topSlider.map(artwork => (
                                    <SwiperSlide>
                                        <SliderArtwork artwork={artwork} key={artwork.id} />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            <div className="swiper-pagination swiper-pagination-clickable swiper-pagination-bullets" ref={swiperPagination}/>
                        </div>
                    </div>
                </section>
            )}
            <section className="auctions-section">
                <div className="container">
                    <div className="section-head">
                        <h3 className="section-title">Live auctions</h3>
                        <Link className="section-head__link" to='/artworks?auction=1'>view all</Link>
                    </div>
                    <div className="cards-wrap">
                        {indexPage?.liveAuctions.map(artwork => <ArtworkCard artwork={artwork} key={artwork.id} />)}
                    </div>
                </div>
            </section>
            <section className="artworks-section">
                <div className="container">
                    <div className="section-head">
                        <h3 className="section-title">Featured artworks</h3>
                        <Link className="section-head__link" to='/artworks'>view all</Link>
                    </div>
                    <div className="cards-wrap">
                        {indexPage?.featuredArtworks.map(artwork => <ArtworkCard artwork={artwork} key={artwork.id} />)}
                    </div>
                    {/*<Cards />*/}
                </div>
            </section>
            <section className="featured-section">
                <div className="container">
                    <div className="section-head">
                        <h3 className="section-title">Featured creators</h3>
                        <Link className="section-head__link" to='/creators'>view all</Link>
                    </div>
                    {indexPage?.featuredCreators.map(creator => <CreatorCard creator={creator} key={creator.id} />)}
                </div>
            </section>
        </main>
    )
});

export default IndexPage;
