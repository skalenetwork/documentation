# Quick start guide

- Overview
- [SEO](#seo)
- [Navigation](#navigation)
- Translations
- [Components](#components)
   - [Note](#note)
   - [Code Block](#code-block)
   - [Button](#button)
   - [Two column section layout](#two-column-section-layout)
   - [Split Section Layout](#split-section-layout)
   - [Steps Layout](#steps-layout)
   - [Katex](#katex)
   - [Embeds](#embeds)
   - [Download button](#download-button)
   - [Flex](#flex)
   - [Box](#box)

<hr/>

# SEO

By default the SEO information is extracted from Prismic, however the following fields can be overwritten with setting the frontmetar as follows:

```
---
title: [title]
description: [page_description]
canonical_url: [url]
---
```

# Navigation

The side navigation on the portal is generated from the nav.json files. which have the following structure:

```
{
  "nav": [
    {
      "name": "developers",
      "links": [
        {
          "link": "/documentation/developers/getting-started",
          "links": [
            {
              "link": "/documentation/developers/getting-started/beginner",
              "depth": 0
            },
            ...
          ]
        },
        {
          "title": "Products",
          "link": "/documentation/developers/products/interchain-messaging-agent/get-started-with-eth",
          "links": [
            {
              "title": "Interchain Messaging Agent",
              "link": "/documentation/developers/products/interchain-messaging-agent/get-started-with-eth",
              "links": [
                { 
                  "link": "/documentation/developers/products/interchain-messaging-agent/get-started-with-eth"
                }
              ]
            },
            ...
          ]
        },
        ...
      ]
    },
    {
      "name":"validators",
      "links":[...]
    },
    {
      "name":"technology",
      "links":[...]
    }
  ]
}
```

There are three sections to navigation: `developers`, `validators` and `technology`. These are the 3 sections that can be accessed through the main navigation bar in the header.

Navigation has a maximum depth of 3, although this is not strictly inforced, however if forcing navigation to have higher depth, any additional nav evels will have the same styles as 3rd level.

Depth count starts from 0, which defaults to first heading found, and depth 1 and 2 default to subheadings of the first heading.

The structure of the individual links that are placed into the links object, are as follows:

```
{
  title: 'Title', # OPTIONAL
  link: '/documentation/developers/getting-started', # REQUIRED
  depth: 1, # OPTIONAL, defaults to 2
  links: [...] # OPTIONAL, accepts same structure as this one
}
```

| Fields   | Description | Required? |
|----------|-------------|------|
| title | The title is there in case you want to overwrite the title that is displayed in the side menu for this entry. When title is set the link supplied will not be traversed for additional headings. The title is useful when there is no actual document associated with this link and the link provided is a link of a child element inside links. | OPTIONAL |
| link | This is a link to the document that you would like to generate side menu for. By default 3 levels of titles will be used to generate child navigation, unless this is overridden with `depth` attribute | REQUIRED |
| depth | This attribute lets you override the depth of the menu that will be generated from the link provided. Accepted values are: 0, 1, 2 | OPTIONAL |
| links | These are additional links used to generate child menu items for the link provided. By default links will have depth of `parent depth - 1`  | OPTIONAL |


# Components

You are able to use all the available md/mdx markdown syntax, such as heading, lists, links, images and any other, which then will be converted into html on render.

Additionally you will be able to use components bellow to style your pages to Skale designs.

## Note

You can you Note component as a block using following syntax:

```
<note>

Message goes here

</note>
```

This approach allows you to use any standard markdown syntax with in the Note tags. Make sure there is a space after the starting tag and before the closing tag, this insures your markdown will be parsed and rendered as expected.

Here is an example note:

<note>

**Note:** This is a great way to highlight important informaton

</note>


For simple messages you can also use note tags on the same line as your message:

```
<note>Message goes here</note>
```

However, be aware that if you use this syntax you will only be able to use html tags in the message rather than standard markdown, i.e. to make text bold you will have to use ```<strong />``` rather than ```**```

## Code Block

To create a Code Block you need to use markdown code wrapper syntax around the code, and for highlighting add the language.
You can find right syntax [here](https://help.github.com/en/github/writing-on-github/creating-and-highlighting-code-blocks#syntax-highlighting)

## Button

<button>[Example Button]()</button>

To create a button you can use the following syntax:

```
<button>[Total Newbie](/documentation/developers/getting-started/beginner)</button>
```

The text between [] will be the label and the text between the () will link the the document. For internal links use relative paths and for external use complete urls.

To change the location of the decorating square that by default is seen on the bottom right, you can use **boxPosition** attribute that can take one of the following values: **BOTTOM_LEFT**, **TOP_LEFT** or **TOP_RIGHT**.

## Two column section layout

Layout example:

<TCSectionLayout>
<TCColumnOne>

Left column

</TCColumnOne>
<TCColumnTwo>

```javascript
Right column
```

</TCColumnTwo>
</TCSectionLayout>

Here is the code to achieve it, (remember to include a space before and after content in the column tags):

```
<TCSectionLayout>
<TCColumnOne>

Left column

</TCColumnOne>
<TCColumnTwo>

` ` `javascript
Right column
` ` `

</TCColumnTwo>
</TCSectionLayout>
```

## Split Section Layout

This is simply a equal split 2 column layout, e.g.:

<SplitSectionLayout>
<SplitSectionColumn>

Column one

<button>[Total Newbie](/documentation/developers/getting-started/beginner)</button>

</SplitSectionColumn>
<SplitSectionColumn>

Column Two

<button boxPosition="BOTTOM_LEFT">[Expert Fast-track](/documentation/developers/getting-started/expert)</button>

</SplitSectionColumn>
</SplitSectionLayout>


Here is the syntax to use:

```
<SplitSectionLayout>
<SplitSectionColumn>

Column one

<button>[Total Newbie](/documentation/developers/getting-started/beginner)</button>

</SplitSectionColumn>
<SplitSectionColumn>

Column Two

<button boxPosition="BOTTOM_LEFT">[Expert Fast-track](/documentation/developers/getting-started/expert)</button>

</SplitSectionColumn>
</SplitSectionLayout>
```

## Two column section layout

To define steps layout you can use the following syntax:

```
<StepsLayout id='StepLayoutId'>


<StepsController>
    <StepNav label='Step One'><ByzantineFaultTolerant/></StepNav>
    <StepNav label='Step Two'><AsynchronousProtocol/></StepNav>
    <StepNav label='Step Three'><LeaderlessConsensus/></StepNav>
    <StepNav label='Step Four'><SendTransaction/></StepNav>
</StepsController>
<Step>

Step One

</Step>
<Step>

Step Two

</Step>
<Step>

Step Three

</Step>
<Step>

Step Four

</Step>
</StepsLayout>
```

$StepNav$ takes Icon tag as a child. You have the following Icons available to use:

```
<AsynchronousProtocol />
<ByzantineFaultTolerant />
<DecentralizedInfrastructure />
<Fundamentals />
<LeaderlessConsensus />
<MitigateSmartContracts />
<Prepare />
<Request />
<SendTransaction />
<ThresholdSignatures />
<ToolsAndLibraries />
```

## Katex

Here is an example inline Katex $h = (2 N + 1) / 3$, and the same katex as a block:

$$
h = (2 N + 1) / 3
$$

To achieve this use the following syntax

```
Inline: $h = (2 N + 1) / 3$
Block:
$$
h = (2 N + 1) / 3
$$
```

## Embeds

You can embed other content into your pages using the following syntax:

```
<Embed html='YOUR CODE GOES HERE' />
```

### Example embeded Typeform:

<Embed html='<div class="typeform-widget" data-url="https://dimitrij.typeform.com/to/JBR2IB" style="width: 100%; height: 500px;"></div> <script> (function() { var qs,js,q,s,d=document, gi=d.getElementById, ce=d.createElement, gt=d.getElementsByTagName, id="typef_orm", b="https://embed.typeform.com/"; if(!gi.call(d,id)) { js=ce.call(d,"script"); js.id=id; js.src=b+"embed.js"; q=gt.call(d,"script")[0]; q.parentNode.insertBefore(js,q) } })() </script>' />


## Download button

```
Text to which the button will be right aligned next to
<download>[Download PDF](https://skale.network/whitepaper)</download>

```

Text to which the button will be right aligned next to
<download>[Download PDF](https://skale.network/whitepaper)</download>

## Flex

Flex component allows you to achieve almost any layout when combined with Box component. For documenttion refer to https://theme-ui.com/components/flex

## Box

Box component allows you to wrap markdown and add styles. For documenttion refer to https://theme-ui.com/components/box
