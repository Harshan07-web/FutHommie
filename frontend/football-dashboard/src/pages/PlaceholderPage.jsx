function PlaceholderPage({ title, description }) {

    return (

        <div className="page">

            <div className="dashboard-widget" style={{ maxWidth: 520, margin: "60px auto", textAlign: "center" }}>

                <h2 style={{ marginBottom: 8 }}>{title}</h2>

                <p className="state" style={{ marginTop: 0 }}>
                    {description ?? "This page is on the roadmap — coming soon."}
                </p>

            </div>

        </div>

    );
}

export default PlaceholderPage;