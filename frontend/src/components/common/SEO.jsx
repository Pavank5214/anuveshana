import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, name, type, keywords, canonical, image }) => {
    return (
        <Helmet>
            {/* Standard metadata tags */}
            <title>{title} | Anuveshana Technologies</title>
            <meta name='description' content={description} />
            {keywords && <meta name='keywords' content={keywords} />}
            {canonical && <link rel="canonical" href={canonical} />}

            {/* End standard metadata tags */}
            {/* Facebook tags */}
            <meta property="og:type" content={type} />
            <meta property="og:title" content={title} />
            <meta property="og:description" content={description} />
            {image && <meta property="og:image" content={image} />}
            {/* End Facebook tags */}
            {/* Twitter tags */}
            <meta name="twitter:creator" content={name} />
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={title} />
            <meta name="twitter:description" content={description} />
            {image && <meta name="twitter:image" content={image} />}
            {/* End Twitter tags */}
        </Helmet>
    );
};

export default SEO;
