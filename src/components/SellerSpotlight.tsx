interface Seller {
  name: string;
  location: string;
  listings: number;
}

interface Props {
  sellers: Seller[];
}

const SellerSpotlight = ({ sellers }: Props) => (
  <section className="seller-section" id="sellers">
    <div className="section-heading">
      <div>
        <span className="eyebrow">Trusted sellers</span>
        <h2>Top sellers driving local commerce</h2>
      </div>
      <p>See seller profiles with active listings and strong local ratings.</p>
    </div>
    <div className="seller-grid">
      {sellers.map((seller) => (
        <article key={seller.name} className="seller-card">
          <div>
            <strong>{seller.name}</strong>
            <p>{seller.location}</p>
          </div>
          <span>{seller.listings} listings</span>
        </article>
      ))}
    </div>
  </section>
);

export default SellerSpotlight;
