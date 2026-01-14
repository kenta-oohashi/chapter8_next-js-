"use client";

import { useParams } from "next/navigation";
import style from './PostsDetail.module.css';
import { useEffect, useState } from "react";
import type { Post } from '../../../_types/Post';

export default function PostsDetail() {
  
  const { id } = useParams<{ id: string}>();

  const [post, setPost] = useState< Post | null>(null);
  const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const fetcher = async () => {
        const res = await fetch(
          `https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts/${id}`
        );
        const data = await res.json();
        setPost(data.post);
        setLoading(false);
      };
      fetcher();
    }, [id]);
  
    if(loading) {
      return <p>データ取得中</p>
    }

  if(!post) {
   return (
     <div role="alert">
        <h1>404 Not Found</h1>
        <p>記事は見つかりませんでした。</p>
      </div>
   );
  }

  return (
<div>
  <div className={style["post-list-container"]}>
    <img src="https://placehold.jp/800x400.png" alt="ダミー画像" />
    <div className={style["post-card-info"]}>
      <div className={style["create-data"]}>{new Date(post.createdAt).toLocaleDateString()}</div>
        <div className={style["post-categories"]}>
          {post.categories.map((category) => (
            <span key={category} className={style["post-tag"]}>{category}</span>
              ))}
        </div>
    </div>
    <h2 className={style["post-title"]}>{post.title}</h2>
    <div className={style["post-content"]} dangerouslySetInnerHTML={{ __html: post.content }}></div>
  </div>
</div>
)}