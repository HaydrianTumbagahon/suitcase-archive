import { useState } from 'react'
import { PageFrame } from '../site/PageFrame'
import { site } from '../data'
import { SceneHeading } from '../components/ui'
import { ArchetypeGuide } from '../components/meta/ArchetypeGuide'
import { TeamCompositions } from '../components/meta/TeamCompositions'
import { TierList } from '../components/meta/TierList'
import type { Role } from '../types'

export default function MetaPage() {
  const [role, setRole] = useState<Role | null>(null)
  const copy = site.metaPage

  return (
    <PageFrame scene={copy.scene} serial={copy.serial} title={copy.title} intro={copy.intro}>
      <div className="meta-opinion-banner">
        <span>{`VERSION ${site.gameVersion} · ${copy.draft} · ${copy.banner}`}</span>
      </div>
      <section aria-labelledby="archetype-guide-heading" className="meta-section">
        <SceneHeading id="archetype-guide-heading" label={copy.archetypeScene} scene={copy.archetypeSceneNumber} title={copy.archetypeTitle} />
        <ArchetypeGuide />
      </section>
      <section aria-labelledby="team-compositions-heading" className="meta-section">
        <SceneHeading id="team-compositions-heading" label={copy.teamsScene} scene={copy.teamsSceneNumber} title={copy.teamsTitle} />
        <TeamCompositions />
      </section>
      <section aria-labelledby="tier-list-heading" className="meta-section">
        <SceneHeading id="tier-list-heading" label={copy.tiersScene} scene={copy.tiersSceneNumber} title={copy.tiersTitle} />
        <TierList role={role} onRoleChange={setRole} />
      </section>
    </PageFrame>
  )
}
