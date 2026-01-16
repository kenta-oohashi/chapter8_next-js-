"use client";

import style from "./Posts.module.css";
import Link  from "next/link";
import { useEffect, useState } from "react";
import type { Post } from '../_types/Post';

type PostsResponce = {
  posts: Post[];
}

export default function PostsIndex() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(
        "https://1hmfpsvto6.execute-api.ap-northeast-1.amazonaws.com/dev/posts"
      );
      const data: PostsResponce = await res.json();
      setPosts(data.posts);
      setLoading(false);
    };
    fetcher();
  }, []);

  if (loading) {
    return <p>データ取得中</p>;
  }

  if (posts.length === 0) {
    return (
      <div role="alert">
        <h1>404 Not Found</h1>
        <p>記事は見つかりませんでした。</p>
      </div>
    );
  }

  return (
    <div className={style["post-list-container"]}>
      {posts.map((post) => (
        <Link
          key={post.id}
          href={`/posts/${post.id}`}
          className={style["post-card"]}
        >
          <div className={style["post-card-info"]}>
            <div className={style["create-data"]}>
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
            <div className={style["post-categories"]}>
              {post.categories.map((category) => (
                <span key={category} className={style["post-tag"]}>
                  {category}
                </span>
              ))}
            </div>
          </div>
          <h2 className={style["post-title"]}>{post.title}</h2>
          <div
            className={style["post-content"]}
            dangerouslySetInnerHTML={{ __html: post.content }}
          ></div>
        </Link>
      ))}
    </div>
  );
}
