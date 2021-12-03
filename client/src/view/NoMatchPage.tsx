function NoMatchPage() {
    // TODO: перепилить егеря из сборки в ссылку на статику
    return (
        <div className="content container is-widescreen has-text-centered">
            <h1>404 Page</h1>

            <img
                src={process.env.PUBLIC_URL + "/img/Jaeger.jpg"}
                width="526" height="526" alt="logo" />

            <h2>Stashes not found. Jeager is a dick!</h2>
        </div>

    )
}

export { NoMatchPage }
