import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';

export default function Post({post}) {
    const {title, content, keywords} = post;
    return (
        <Card style={{ margin: '20px', backgroundColor: '#f5f5f5', borderRadius: '10px', width:'500px' }}>
            <CardContent>
                <Typography variant="h5" component="h2">
                    {title}
                </Typography>
                <Typography variant="body2" component="p">
                    {content.text}
                </Typography>
                <Typography variant="body2" component="p">
                    {content.position}
                </Typography>
                {/*<img src={content.image} alt="post" />*/}
                <Typography variant="body2" component="p">
                    {keywords.join(', ')}
                </Typography>
            </CardContent>
        </Card>
    );
}