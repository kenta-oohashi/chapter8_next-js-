"use client";

import style from "./Posts.module.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Post } from "../_types/Post";
import Image from "next/image";

type PostsResponce = {
  contents: Post[];
};

export default function PostsIndex() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetcher = async () => {
      const res = await fetch(`https://n9u0id58lf.microcms.io/api/v1/posts`, {
        headers: {
          "X-MICROCMS-API-KEY": process.env
            .NEXT_PUBLIC_MICROCMS_API_KEY as string,
        },
      });
      const data: PostsResponce = await res.json();
      setPosts(data.contents);
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
          {post.thumbnail ? (
            <Image
              src={post.thumbnail.url}
              alt={post.title}
              width={300}
              height={160}
              className={style.thumbnail}
            />
          ) : (
            <Image
              src="https://placehold.jp/300x160.png"
              alt="ダミー画像"
              width={300}
              height={160}
            />
          )}
          <div className={style["post-card-info"]}>
            <div className={style["create-data"]}>
              {new Date(post.createdAt).toLocaleDateString()}
            </div>
            <div className={style["post-categories"]}>
              {post.categories.map((category) => (
                <span key={category.id} className={style["post-tag"]}>
                  {category.name}
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
