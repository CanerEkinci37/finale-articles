import Navbar from '../components/Navbar';

const Home = () => {

  return (
    <div>
      <Navbar />
      {/* <div style={{ padding: '20px' }}>
        {loading ? (
          <div>Loading articles...</div>
        ) : (
          <div>
            {articles.map((article) => (
              <div key={article.id}>
                <h2>{article.title}</h2>
                <p>{article.content}</p>
              </div>
            ))}
          </div>
        )}
      </div> */}
    </div>
  );
};

export default Home;
