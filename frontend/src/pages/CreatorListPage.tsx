import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import { CondensedProfileType } from "../utils/graphql-gqlr";
import CreatorCard from "../components/index/CreatorCard";
import { useInjection } from "inversify-react";
import { Api } from "../utils/api";
import { useHistory } from "react-router";
import qs from 'qs';

interface ICreatorListPageProps {
}

const CreatorListPage = ({}: ICreatorListPageProps) => {
    const history = useHistory();
    const api = useInjection(Api);

    const [ id, setId ] = useState(1);
    const [ hasMore, setHasMore ] = useState<boolean>(undefined);
    const [ items, setItems ] = useState<CondensedProfileType[]>([]);
    const [ q, setQ ] = useState('');
    const [ loading, setLoading ] = useState(false);

    const loadCreators = async (page) => {
        setLoading(true);
        const result = await api.creatorsIndex(q, page);
        setHasMore(result.hasMore);
        setItems(items.concat(result.items));
        setLoading(false);
    }

    const onSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        history.push(`/creators?q=${q}`)
    }

    useEffect(() => {
        const q = qs.parse(history.location.search, { ignoreQueryPrefix: true });
        setQ(q.q as string || '');
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
                        {/*<select className="search__select" id="search" name="search-select">
                            <option value="All categories">All categories</option>
                            <option value="Categories 1">Categories 1</option>
                            <option value="Categories 2">Categories 2</option>
                        </select>*/}
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
                        {items.map(creator => <CreatorCard creator={creator} key={creator.id} />)}
                        {!loading && items.length === 0 && <p>Sorry, no matches were found for your query</p>}
                    </InfiniteScroll>
                </div>
            </section>
        </main>
    )
};

export default CreatorListPage;
