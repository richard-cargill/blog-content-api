const {createClient} = require('contentful');
const {send} = require('micro');
const marked = require('marked');
const cors = require('micro-cors')({
  origin: '*'
});

require('dotenv').config();

function query () {
  const client = createClient({
    space: process.env.SPACE,
    accessToken: process.env.ACCESS_TOKEN
  }); 
  return client.getEntries({'content_type': '2wKn6yEnZewu2SCCkus4as'})
}

function postFactory (obj) {
  const body = marked(obj.fields.body);
  return {
    body, 
    slug: obj.fields.slug, 
    title: obj.fields.title
  };
}

module.exports = cors(async (req, res) => {
  const posts = await query();
  const formattedPosts = posts.items.map(postFactory)
  return send(res, 200, formattedPosts);
})
