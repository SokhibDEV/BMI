import { useState, useEffect } from 'react'
import Home from './pages/Home'
import Commits from './pages/Commits'
import Diff from './pages/Diff'
import AIAnalysis from './pages/AIAnalysis'
import Dashboard from './pages/Dashboard'

export default function App() {
  const [page, setPage] = useState('home')
  const [repoUrl, setRepoUrl] = useState('')
  const [selectedCommit, setSelectedCommit] = useState(null)
  const [commitsList, setCommitsList] = useState([])
  const [repoPathName, setRepoPathName] = useState('')

  // URL manzil satrini sahifaga qarab sun'iy o'zgartirish mantiqi
  useEffect(() => {
    if (page === 'home') {
      window.history.pushState({}, '', '/');
    } else {
      window.history.pushState({}, '', `/${page}`);
    }
  }, [page]);

  if (page === 'commits') 
    return (
      <Commits 
        repoUrl={repoUrl} 
        commits={commitsList} 
        onBack={() => setPage('home')} 
        onSelectCommit={(commit) => { 
          setSelectedCommit(commit); 
          setPage('diff') 
        }} 
      />
    )

  if (page === 'diff') 
    return (
      <Diff 
        commit={selectedCommit} 
        repoPathName={repoPathName} 
        onBack={() => setPage('commits')} 
        onAIAnalysis={() => setPage('ai')} 
      />
    )

  if (page === 'ai') 
    return (
      <AIAnalysis 
        commit={selectedCommit} 
        repoPathName={repoPathName} 
        onBack={() => setPage('diff')} 
      />
    )

  if (page === 'dashboard') 
    return (
      <Dashboard 
        repoUrl={repoUrl} 
        repoPathName={repoPathName} 
        onBack={() => setPage('home')} 
      />
    )

  return (
    <Home 
      onAnalyze={(commits, pathName, url) => { 
        setCommitsList(commits);     
        setRepoPathName(pathName);   
        setRepoUrl(url);             
        setPage('commits');          
      }} 
      onDashboard={(url) => { 
        setRepoUrl(url); 
        setPage('dashboard') 
      }} 
    />
  )
}
