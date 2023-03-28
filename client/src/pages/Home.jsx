import React, { useState, useEffect } from "react";
import { Card, FormField, Loader } from "../components";

function RenderCards({ data, title }) {
  if (data?.length > 0) {
    return data.map((post) => <Card key={post._id} {...post} />);
  }

  return (
    <h2 className="mt-5 font-bold text-[#6449ff] text-xl uppercase">{title}</h2>
  );
}

export function Home() {
  const [loading, setLoading] = useState(false);
  const [allPost, setAllPost] = useState(null);
  const [searchText, setSearchText] = useState("");

  const [searchedResults, setSearchedResults] = useState(null);
  const [searchTimeout, setSearchTimeout] = useState(null);

  useEffect(() => {
    async function fetchPosts() {
      setLoading(true);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_SERVER_URL}/api/v1/post`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const result = await response.json();

          setAllPost(result.data);
        }
      } catch (error) {
        alert(error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  function handleSearchChange(event) {
    clearTimeout(searchTimeout);
    setSearchText(event.target.value);

    setSearchTimeout(
      setTimeout(() => {
        const searchResults = allPost.filter(
          (item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.prompt.toLowerCase().includes(searchText.toLowerCase())
        );
        setSearchedResults(searchResults);
      }, 500)
    );
  }

  return (
    <section className="max-w-7xl mx-auto">
      <div>
        <h1 className="font-extrabold text-[#222328] text-[32px]">
          The Comunity Showcase
        </h1>
        <p className="mt-2 text-[#666e75] text-[18px] max-w[32px]">
          Browse through a collection of imaginative and visually stunning
          images generated by DALL-E AI
        </p>
      </div>
      <div className="mt-16">
        <FormField
          labelName="Search post"
          type="text"
          name="text"
          placeholder="Search post"
          value={searchText}
          handleChange={handleSearchChange}
        />
      </div>
      <div className="mt-10">
        {loading ? (
          <div className="flex justify-center items-center">
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className="font-medium text-[#666e75] text-xl mb-3">
                Showing results for{" "}
                <span className="text-[#222328]">{searchText}</span>
              </h2>
            )}

            <div className="grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3">
              {searchText ? (
                <RenderCards
                  data={searchedResults}
                  title="No search results found"
                />
              ) : (
                <RenderCards data={allPost} title="No posts found" />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
