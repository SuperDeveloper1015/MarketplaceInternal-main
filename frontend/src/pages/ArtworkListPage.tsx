import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { ArtworkType, CondensedProfileType } from "../utils/graphql-gqlr";
import CreatorCard from "../components/index/CreatorCard";
import { useInjection } from "inversify-react";
import { Api } from "../utils/api";
import { useHistory } from "react-router";
import qs from 'qs';
import ArtworkCard from "../components/artwork/ArtworkCard";
import NiceSelect from "../components/NiceSelect";

interface ICreatorListPageProps {
}

const ArtworkListPage = ({}: ICreatorListPageProps) => {
    const history = useHistory();
    const api = useInjection(Api);

    const [ id, setId ] = useState(1);
    const [ hasMore, setHasMore ] = useState<boolean>(undefined);
    const [ items, setItems ] = useState<ArtworkType[]>([]);
    const [ auction, setAuction ] = useState(false);
    const [ q, setQ ] = useState('');

    const loadCreators = async (page) => {
        const result = await api.artworksIndex(q, auction, page);
        setHasMore(result.hasMore);
        setItems(items.concat(result.items));
    }

    const onSearch = (e?: React.FormEvent) => {
        e?.preventDefault();
        history.push(`/artworks?q=${q}${auction ? '&auction=1' : ''}`);
    }

    const onAuctionToggle = (value) => {
        history.push(`/artworks?q=${q}${value ? '&auction=1' : ''}`);
    }

    useEffect(() => {
        const q = qs.parse(history.location.search, { ignoreQueryPrefix: true });
        setQ(q.q as string || '');
        setAuction(Boolean(q.auction))
        setHasMore(true);
        setItems([]);
        setId(Math.random());
    }, [history.location.search]);

    return (
        <main className="main">
            <div className="container">
                <form className="form-search" onSubmit={onSearch}>
                    <div className="search">
                        <button className="search__btn" type="submit" style={{ backgroundImage: `url(${require('../images/search.svg')})` }}/>
                        <input className="search__input" type="text" placeholder="Search" value={q} onChange={e => setQ(e.target.value)}/>
                        <NiceSelect
                            className="search__select"
                            value={auction}
                            onChange={onAuctionToggle}
                            options={[
                                { value: false, label: 'All' },
                                { value: true, label: 'On auction' },
                            ]}
                        />
                    </div>
                </form>
            </div>
            <section className="featured-section">
                <div className="container">
                    <InfiniteScroll
                        key={id}
                        pageStart={-1}
                        loadMore={loadCreators}
                        hasMore={hasMore}
                        loader={<div className="loader" key={0}>Loading...</div>}
                        className='cards-wrap'
                    >
                        {items.map(artwork => <ArtworkCard artwork={artwork} key={artwork.id} />)}
                    </InfiniteScroll>
                </div>
            </section>
        </main>
    )
};

export default ArtworkListPage;
