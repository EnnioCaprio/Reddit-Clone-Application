import React from 'react';
import { Link } from 'react-router-dom';

const NotFound = () => {
    return(
        <div className="container-notFound">
            <div>
                <h1>Page not found</h1>
                <p>Click here on the link below to get back</p>
                <Link to="/">
                    <p>Homepage</p>
                </Link>
            </div>
        </div>
    )
}

export {NotFound as default}