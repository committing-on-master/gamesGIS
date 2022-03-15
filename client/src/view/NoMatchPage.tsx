import { EndPoints } from "../api/endPoints";

import styles from './NoMatchPage.module.scss';

function NoMatchPage() {
    // TODO: перепилить егеря из сборки в ссылку на статику
    return (
        <div className={styles.container}>
            <h1>404 Page</h1>

            <img
                src={`${EndPoints.Protocol}://${EndPoints.Host}/img/Jaeger.jpg`}
                width="526" height="526" alt="logo" />

            <h2>Stashes not found. Jeager is a dick!</h2>
        </div>

    )
}

export { NoMatchPage }
