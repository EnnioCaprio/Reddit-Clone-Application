FROM node:12.20.0 as build
WORKDIR /app
COPY package.json ./
COPY yarn.lock ./
RUN yarn install

ARG REACT_APP_URL
ENV REACT_APP_URL=$REACT_APP_URL
ARG REACT_APP_APOLLO_URL
ENV REACT_APP_APOLLO_URL=$REACT_APP_APOLLO_URL

RUN echo $REACT_APP_URL
RUN echo $REACT_APP_APOLLO_URL
COPY . .
RUN npm run build

FROM nginx
EXPOSE 3000
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/build /usr/share/nginx/html
