"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import "./family-tree.css"
import { familyData } from "./family-data"

// Types
type Person = {
  name: string
  birth?: string
  death?: string
  married?: string
  imageSrc?: string
  marriageDate?: string
  marriagePlace?: string
  type?: string
  partner1?: Person
  partner2?: Person
}

type Couple = {
  partner1: Person
  partner2: Person
  marriageDate?: string
  marriagePlace?: string
  type: "couple"
}

type PersonOrCouple = Person | Couple
type FocusedPerson = Person | Couple | null

type PersonCardProps = {
  person: Person
  onClick?: (person: Person) => void
  showExpand?: boolean
  onExpand?: () => void
  expanded?: boolean
}

type CoupleCardProps = {
  partner1: Person
  partner2: Person
  marriageDate?: string
  marriagePlace?: string
  onClick?: (couple: Couple) => void
  showExpand?: boolean
  onExpand?: () => void
  expanded?: boolean
}

type FamilyUnitProps = {
  parents: Person[]
  children?: Array<{
    parents: Person[]
    children?: any[]
  }>
  forceVisible?: boolean
  onPersonClick: (person: FocusedPerson) => void
  onChildExpand?: (childName: string | null) => void
  parentActiveChild?: string | null
}

type FocusModalProps = {
  focusedPerson: FocusedPerson
  onClose: () => void
}

// Individual Person Card Component
const PersonCard: React.FC<PersonCardProps> = ({ person, onClick }) => (
  <div className="person-card-compact">
    <div className="person-avatar-small" onClick={() => onClick && onClick(person)}>
      {person.imageSrc ? (
        <img src={person.imageSrc || "/placeholder.svg"} alt={person.name} className="avatar-image-small" />
      ) : (
        <div className="avatar-placeholder-small">
          {person.name
            .split(" ")
            .map((n) => n[0])
            .join("")}
        </div>
      )}
      <div className="focus-indicator">🔍</div>
    </div>
    <p className="person-name-compact">{person.name.split(" ")[0]}</p>
  </div>
)

// Couple Component (for married pairs)
const CoupleCard: React.FC<CoupleCardProps> = ({
  partner1,
  partner2,
  marriageDate,
  marriagePlace,
  onClick,
  showExpand = false,
  onExpand,
  expanded = false,
}) => (
  <div className="couple-container-compact">
    <div className="couple-cards-small">
      <PersonCard
        person={partner1}
        onClick={() => onClick && onClick({ partner1, partner2, marriageDate, marriagePlace, type: "couple" })}
      />
      <div className="marriage-connector">♥</div>
      <PersonCard
        person={partner2}
        onClick={() => onClick && onClick({ partner1, partner2, marriageDate, marriagePlace, type: "couple" })}
      />
    </div>
    {showExpand && (
      <div className="expand-btn-small" onClick={onExpand}>
        {expanded ? "−" : "+"}
      </div>
    )}
  </div>
)

// Individual Family Component
const FamilyUnit: React.FC<FamilyUnitProps> = ({
  parents,
  children,
  forceVisible = false,
  onPersonClick,
  onChildExpand,
  parentActiveChild,
}) => {
  const [expanded, setExpanded] = useState(forceVisible)
  const [activeChild, setActiveChild] = useState<string | null>(null)

  const handleExpand = () => {
    const newExpanded = !expanded
    setExpanded(newExpanded)

    if (newExpanded) {
      if (onChildExpand) {
        onChildExpand(parents[0].name)
      }
    } else {
      setActiveChild(null)
      if (onChildExpand) {
        onChildExpand(null)
      }
    }
  }

  const handleChildExpand = (childName: string | null) => {
    setActiveChild(childName)
  }

  const isHidden = !forceVisible && parentActiveChild !== null && parentActiveChild !== parents[0].name

  if (isHidden) {
    return null
  }

  return (
    <li className={`family-unit ${forceVisible ? "root-family" : ""} ${expanded ? "expanded" : ""}`}>
      <div className="parents-container">
        {parents.length === 1 ? (
          <PersonCard
            person={parents[0]}
            onClick={onPersonClick}
            showExpand={children && children.length > 0}
            onExpand={handleExpand}
            expanded={expanded}
          />
        ) : (
          <CoupleCard
            partner1={parents[0]}
            partner2={parents[1]}
            marriageDate={parents[0].marriageDate || parents[1].marriageDate}
            marriagePlace={parents[0].marriagePlace || parents[1].marriagePlace}
            onClick={onPersonClick}
            showExpand={children && children.length > 0}
            onExpand={handleExpand}
            expanded={expanded}
          />
        )}
      </div>

      {expanded && children && children.length > 0 && (
        <ul className="children-container">
          {children.map((child, index) => {
            const childKey = child.parents[0].name

            return (
              <FamilyUnit
                key={childKey}
                parents={child.parents}
                children={child.children}
                forceVisible={false}
                onPersonClick={onPersonClick}
                onChildExpand={handleChildExpand}
                parentActiveChild={activeChild}
              />
            )
          })}
        </ul>
      )}
    </li>
  )
}

// Focus Modal Component
const FocusModal: React.FC<FocusModalProps> = ({ focusedPerson, onClose }) => {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (focusedPerson) {
      setTimeout(() => {
        modalRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 0)
    }
  }, [focusedPerson])

  if (!focusedPerson) return null

  if (focusedPerson.type === "couple") {
    const couple = focusedPerson as Couple
    return (
      <div className="focus-overlay" onClick={onClose} ref={modalRef}>
        <div className="focus-modal couple-modal" onClick={(e) => e.stopPropagation()}>
          <button className="close-btn" onClick={onClose}>
            ×
          </button>
          <div className="couple-focus-cards">
            <div className="focus-person">
              <div className="focus-avatar">
                {couple.partner1 && couple.partner1.imageSrc ? (
                  <img
                    src={couple.partner1.imageSrc || "/placeholder.svg"}
                    alt={couple.partner1.name}
                    className="focus-image"
                  />
                ) : couple.partner1 ? (
                  <div className="focus-placeholder">{couple.partner1.name.split(" ").map((n) => n[0])}</div>
                ) : null}
              </div>
              <h2 className="focus-name">{couple.partner1 ? couple.partner1.name : ""}</h2>
              {couple.partner1 && couple.partner1.birth && (
                <p className="focus-detail">Born: {couple.partner1.birth}</p>
              )}
              {couple.partner1 && couple.partner1.death && couple.partner1.death !== "Living" && (
                <p className="focus-detail">Died: {couple.partner1.death}</p>
              )}
            </div>
            <div className="marriage-focus-info">
              <div className="heart-large">♥</div>
              <div className="marriage-focus-details">
                {couple.marriageDate && <p>Married: {couple.marriageDate}</p>}
                {couple.marriagePlace && <p>{couple.marriagePlace}</p>}
              </div>
            </div>
            <div className="focus-person">
              <div className="focus-avatar">
                {couple.partner2 && couple.partner2.imageSrc ? (
                  <img
                    src={couple.partner2.imageSrc || "/placeholder.svg"}
                    alt={couple.partner2.name}
                    className="focus-image"
                  />
                ) : couple.partner2 ? (
                  <div className="focus-placeholder">{couple.partner2.name.split(" ").map((n) => n[0])}</div>
                ) : null}
              </div>
              <h2 className="focus-name">{couple.partner2 ? couple.partner2.name : ""}</h2>
              {couple.partner2 && couple.partner2.birth && (
                <p className="focus-detail">Born: {couple.partner2.birth}</p>
              )}
              {couple.partner2 && couple.partner2.death && couple.partner2.death !== "Living" && (
                <p className="focus-detail">Died: {couple.partner2.death}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const person = focusedPerson as Person
  return (
    <div className="focus-overlay" onClick={onClose} ref={modalRef}>
      <div className="focus-modal" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ×
        </button>
        <div className="focus-content">
          <div className="focus-avatar">
            {person.imageSrc ? (
              <img src={person.imageSrc || "/placeholder.svg"} alt={person.name} className="focus-image" />
            ) : (
              <div className="focus-placeholder">{person.name.split(" ").map((n) => n[0])}</div>
            )}
          </div>
          <h2 className="focus-name">{person.name}</h2>
          {person.birth && <p className="focus-detail">Born: {person.birth}</p>}
          {person.death && person.death !== "Living" && <p className="focus-detail">Died: {person.death}</p>}
          {person.married && <p className="focus-detail">Marital Status: {person.married}</p>}
        </div>
      </div>
    </div>
  )
}

// Main Family Tree Component
const FamilyTree: React.FC = () => {
  const [focusedPerson, setFocusedPerson] = useState<FocusedPerson>(null)

  const handlePersonClick = (person: FocusedPerson) => {
    setFocusedPerson(person)
  }


  return (
    <div className="family-tree-container">
      <div className="tree-header">
        <div className="header-tree-image">
          <img src="/assets/Whalin/clovers.png" alt="Family Tree" className="tree-photo" />
        </div>
        <h1 className="tree-title">Whalin Family Tree</h1>
        <h1 className="other-tree-link">
          <a href="https://vernetti-family-tree.netlify.app/" target="_blank" rel="noopener noreferrer">
          Vernetti Family Tree
          </a>
          </h1>
        <p className="tree-subtitle">Click on family members to explore their details</p>
      </div>

      <div className="tree-wrapper">
        <ul className="tree-root">
          <FamilyUnit
            parents={familyData.parents}
            children={familyData.children}
            forceVisible={true}
            onPersonClick={handlePersonClick}
          />
        </ul>
      </div>

      <FocusModal focusedPerson={focusedPerson} onClose={() => setFocusedPerson(null)} />
    </div>
  )
}

export default FamilyTree
