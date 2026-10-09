import { useState } from 'react'
import { Button, Chip, Icon, Marquee, Panel, Rarity, SceneHeading, SmartImage, Sticker } from '../components/ui'

const sampleIcons = [
  { category: 'afflatus', values: ['Beast', 'Mineral', 'Plant', 'Star', 'Spirit', 'Intellect'] },
  { category: 'damage', values: ['Reality', 'Mental'] },
  { category: 'role', values: ['DPS', 'Support', 'Dynamo', 'Heal', 'Extra Action'] },
] as const

export default function KitPage() {
  const [selected, setSelected] = useState(false)

  return (
    <div className="page-frame ui-kit">
      <h1>Interface kit</h1>
      <p className="page-intro">A field guide to the archive’s reusable interface pieces.</p>

      <section className="ui-kit__section" aria-labelledby="buttons-heading">
        <h2 id="buttons-heading">Buttons &amp; labels</h2>
        <div className="ui-kit__row">
          <Button>Primary action</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="danger">Danger</Button>
        </div>
        <div className="ui-kit__row">
          <Sticker>Filed</Sticker>
          <Sticker tilt={2} tone="oxblood">Spoilers</Sticker>
          <Sticker tilt={-4} tone="verdigris">Verified</Sticker>
          <Sticker tone="parchment">Archive copy</Sticker>
        </div>
      </section>

      <section className="ui-kit__section" aria-labelledby="surfaces-heading">
        <h2 id="surfaces-heading">Surfaces &amp; filters</h2>
        <div className="ui-kit__grid">
          <Panel>
            <h3>Filed observation</h3>
            <p>Hard edges, clear hierarchy, and a paper trail for every record.</p>
          </Panel>
          <Panel>
            <h3>Filter specimen</h3>
            <p>Toggle a chip to check its pressed state and brass accent.</p>
            <Chip onPressedChange={setSelected} pressed={selected}>
              {selected ? 'Selected' : 'Unselected'}
            </Chip>
          </Panel>
        </div>
      </section>

      <section className="ui-kit__section" aria-labelledby="section-heading">
        <h2 id="section-heading">Section heading</h2>
        <SceneHeading title="The reading room" />
      </section>

      <section className="ui-kit__section" aria-labelledby="image-heading">
        <h2 id="image-heading">Image slot</h2>
        <div className="ui-kit__image-row">
          <SmartImage alt="Portrait placeholder" aspectRatio="3:4" label="Portrait" src={null} />
          <SmartImage alt="Landscape placeholder" aspectRatio="16:9" label="Archive still" src={null} />
        </div>
      </section>

      <section className="ui-kit__section" aria-labelledby="icon-heading">
        <h2 id="icon-heading">Optional label icons</h2>
        {sampleIcons.map(({ category, values }) => (
          <div className="ui-kit__icon-row" key={category}>
            <span className="ui-kit__icon-category">{category}</span>
            {values.map((value) => (
              <span className="ui-kit__icon-sample" key={value}>
                <Icon category={category} value={value} />
              </span>
            ))}
          </div>
        ))}
        <div className="ui-kit__icon-row">
          <span className="ui-kit__icon-category">rarity</span>
          {[2, 3, 4, 5, 6].map((value) => <Rarity key={value} value={value} />)}
        </div>
      </section>

      <section className="ui-kit__section" aria-labelledby="marquee-heading">
        <h2 id="marquee-heading">Ticker strip</h2>
        <Marquee label="Archive dispatch ticker">
          <span>DISPATCH FROM THE ARCHIVE</span>
          <span aria-hidden="true">✳</span>
          <span>CHECK EVERY RECORD</span>
          <span aria-hidden="true">✳</span>
        </Marquee>
      </section>
    </div>
  )
}
