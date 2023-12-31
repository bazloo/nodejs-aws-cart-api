#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { RestApi, LambdaIntegration } from 'aws-cdk-lib/aws-apigateway';
import { Code, LayerVersion, Runtime, Function } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Stack } from 'aws-cdk-lib';
import { Construct } from 'constructs';

class CartServiceStack extends Stack {
  constructor(scope: Construct) {
    super(scope, 'cart-store');

    const cartApiHandler = new Function(this, 'cart-api-handler', {
      code: Code.fromAsset('dist'),
      handler: 'main.handler',
      runtime: Runtime.NODEJS_18_X,
      environment: {
        DB_USERNAME: process.env.DB_USERNAME,
        DB_PASSWORD: process.env.DB_PASSWORD,
        DB_NAME: process.env.DB_NAME,
        DB_HOST: process.env.DB_HOST,
      },
    });

    const api = new RestApi(this, "cart-service-proxy-api", {
      deploy: true,
      defaultCorsPreflightOptions: {
        allowHeaders: ['*'],
        allowOrigins: ['*'],
        allowMethods: ['ANY'],
      },
    });

    api.root.addProxy({
      defaultIntegration: new LambdaIntegration(cartApiHandler, { proxy: true }),
    });
  }
}

new CartServiceStack(new cdk.App());