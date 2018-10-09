Setup:
in infrastructure/

`aws-vault exec kabisa-bart-playground`
`(cd  tables/examples/ && aws dynamodb batch-write-item --request-items file://Availability.json)`


Development:
`yarn`
`(cd infrastructure; sls dynamodb install)`
`yarn run dev`

Deploy:
```
cd dist/

yarn run build

aws-vault exec kabisa-playground

aws s3 sync . s3://kabisa-tickets-dev-hosting --include "*" --exclude "*.js" --exclude "*.css"
aws s3 sync . s3://kabisa-tickets-dev-hosting --delete --exclude "*" --include "*.js" --include "*.css" --content-encoding=gzip


```

Killing serverless-offline in case of it still running:
`lsof -i :8000 -sTCP:LISTEN |awk 'NR > 1 {print $2}' | xargs kill -15`