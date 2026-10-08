import { filterTeams, getTeamArchetypes } from '../../data'
import { Panel } from '../ui'

export function ArchetypeGuide() {
  const archetypes = getTeamArchetypes()
  return (
    <div className="meta-archetype-grid">
      {archetypes.map((archetype) => {
        const example = filterTeams(archetype)[0]
        return (
          <Panel className="meta-archetype-card" key={archetype}>
            <span className="scene-label">{archetype}</span>
            <h3>{example?.name}</h3>
            <p>{example?.explainer}</p>
          </Panel>
        )
      })}
    </div>
  )
}
