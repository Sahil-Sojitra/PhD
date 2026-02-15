function PageShell({ title, children, footer }) {
    return (
        <main className="page-shell">
            <section className="card">
                <h1 className="page-title">{title}</h1>
                <div className="page-content">{children}</div>
                {footer ? <div className="page-footer">{footer}</div> : null}
            </section>
        </main>
    )
}

export default PageShell