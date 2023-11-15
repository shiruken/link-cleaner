import { Devvit } from '@devvit/public-api';

Devvit.configure({
  redditAPI: true,
});

Devvit.addMenuItem({
  location: ['post', 'comment'],
  label: 'Get Clean Link',
  onPress: async (event, context) => {
    const id = event.targetId;
    console.log(id);

    let permalink: string;
    if (id.includes("t3_")) {
      const post = await context.reddit.getPostById(id);
      permalink = post.permalink;
    } else if (id.includes("t1_")) {
      const comment = await context.reddit.getCommentById(id);
      permalink = comment.permalink;
    } else {
      context.ui.showToast({
        appearance: "neutral", // No error appearance yet
        text: "Something went wrong. Please try again."
      });
      throw new Error(`Object is not a post or comment: ${id}`);
    }

    const formData = {
      url: `https://www.reddit.com${permalink}`
    };
    context.ui.showForm(form, formData);
  },
});

const form = Devvit.createForm((data) => {
  return {
    fields: [{ 
      name: 'url',
      label: 'Clean URL',
      type: 'string',
      defaultValue: data.url,
      helpText: 'Permalink without Reddit tracking tags',
      disabled: false
    }],
  }
}, () => {
  // pass
});

export default Devvit;
