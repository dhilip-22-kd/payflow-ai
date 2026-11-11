import { useEffect, useState } from 'react'
import './App.css'

const transactions = [
  {
    id: 'PF-2026-1042',
    merchantOrder: 'ORD-1042',
    customer: 'Alex Morgan',
    amount: '$249.00',
    status: 'Needs review',
    type: 'Capture verification',
    time: '10:42 AM',
    initials: 'AM',
  },
  {
    id: 'PF-2026-1041',
    merchantOrder: 'ORD-1041',
    customer: 'Sarah Chen',
    amount: '$128.50',
    status: 'Completed',
    type: 'Payment completed',
    time: '10:31 AM',
    initials: 'SC',
  },
  {
    id: 'PF-2026-1040',
    merchantOrder: 'ORD-1040',
    customer: 'James Wilson',
    amount: '$89.99',
    status: 'Pending',
    type: 'Awaiting confirmation',
    time: '10:18 AM',
    initials: 'JW',
  },
  {
    id: 'PF-2026-1039',
    merchantOrder: 'ORD-1039',
    customer: 'Emily Davis',
    amount: '$420.00',
    status: 'Action required',
    type: 'Order mismatch',
    time: '09:56 AM',
    initials: 'ED',
  },
  {
    id: 'PF-2026-1038',
    merchantOrder: 'ORD-1038',
    customer: 'Noah Taylor',
    amount: '$64.00',
    status: 'Completed',
    type: 'Payment completed',
    time: '09:42 AM',
    initials: 'NT',
  },
]

const navItems = [
  { label: 'Overview', icon: '◫' },
  { label: 'Transactions', icon: '⇄' },
  { label: 'Reconciliation', icon: '⟳' },
  { label: 'AI Copilot', icon: '✳' },
  { label: 'Recovery Center', icon: '↗' },
]

function App() {
  const [activePage, setActivePage] = useState('Overview')
  const [selectedTransaction, setSelectedTransaction] = useState(transactions[0])
  const [question, setQuestion] = useState('')
  const [search, setSearch] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [analysis, setAnalysis] = useState(false)
  const [apiTransactions, setApiTransactions] = useState([])
  const [loadingTransactions, setLoadingTransactions] = useState(true)
  const [transactionError, setTransactionError] = useState('')

  useEffect(() => {
    const controller = new AbortController()

    async function loadTransactions() {
      try {
        setLoadingTransactions(true)
        setTransactionError('')

        const response = await fetch(
          'http://localhost:8080/api/transactions',
          { signal: controller.signal }
        )

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`)
        }

        const data = await response.json()

        const formattedTransactions = data.map((item) => ({
          id: item.transactionId || `DB-${item.id}`,
          merchantOrder: item.transactionId || `ORDER-${item.id}`,
          customer: item.customerName || 'Unknown customer',
          amount: `${item.currency || ''} ${Number(item.amount).toFixed(2)}`,
          status:
            item.status === 'COMPLETED'
              ? 'Completed'
              : item.status === 'PENDING'
                ? 'Pending'
                : item.status || 'Unknown',
          type: 'Database transaction',
          time: item.createdAt
            ? new Date(item.createdAt).toLocaleString()
            : 'Time unavailable',
          initials: (item.customerName || 'UC')
            .split(' ')
            .map((part) => part[0])
            .join('')
            .slice(0, 2)
            .toUpperCase(),
        }))

        setApiTransactions(formattedTransactions)

        if (formattedTransactions.length > 0) {
           setSelectedTransaction(formattedTransactions[0])
            }
      } catch (error) {
        if (error.name !== 'AbortError') {
          console.error('Transaction fetch failed:', error)
          setTransactionError(
            'Unable to load transactions from the backend.'
          )
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingTransactions(false)
        }
      }
    }

    loadTransactions()

    return () => controller.abort()
  }, [])



const filteredTransactions = apiTransactions.filter((transaction) => {
  const text =
    `${transaction.id} ${transaction.merchantOrder} ${transaction.customer} ${transaction.status}`.toLowerCase()

  return text.includes(search.toLowerCase())
})



  const visibleTransactions = showAll
    ? filteredTransactions
    : filteredTransactions.slice(0, 4)

  function openCopilot(transaction = selectedTransaction) {
    setSelectedTransaction(transaction)
    setActivePage('AI Copilot')
    setAnalysis(false)
  }

  function runAnalysis() {
    setAnalysis(true)
    setQuestion('')
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <button className="brand" onClick={() => setActivePage('Overview')}>
          <span className="brand-mark">P</span>
          <span>
            <strong>PayFlow<span className="brand-ai"> AI</span></strong>
            <small>PAYMENT INTELLIGENCE</small>
          </span>
        </button>

        <div className="workspace-label">WORKSPACE</div>
        <button className="workspace-switcher">
          <span className="workspace-avatar">M</span>
          <span className="workspace-text">
            <strong>My Store</strong>
            <small>Sandbox environment</small>
          </span>
          <span className="switcher-arrow">⌄</span>
        </button>

        <div className="nav-heading">PAYMENT OPERATIONS</div>

        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <button
              key={item.label}
              className={`nav-item ${activePage === item.label ? 'active' : ''}`}
              onClick={() => setActivePage(item.label)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.label === 'Recovery Center' && (
                <span className="nav-count">2</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="sandbox-card">
            <div className="sandbox-indicator">
              <span className="status-dot" />
              SANDBOX MODE
            </div>
            <p>Test environment active. No real payments are processed by this demo.</p>
          </div>

          <button
            className="nav-item settings-link"
            onClick={() => setActivePage('Settings')}
          >
            <span className="nav-icon">⚙</span>
            Settings
          </button>

          <div className="profile">
            <div className="profile-avatar">DK</div>
            <div className="profile-info">
              <strong>Store Admin</strong>
              <small>Merchant workspace</small>
            </div>
            <span className="profile-menu">•••</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div className="breadcrumbs">
            <span>Workspace</span>
            <span className="breadcrumb-divider">/</span>
            <strong>{activePage}</strong>
          </div>

          <div className="topbar-actions">
            <div className="environment-pill">
              <span className="status-dot" />
              Sandbox
            </div>
            <button
              className="icon-button notification-button"
              aria-label="Notifications"
              title="Notifications"
            >
              ♧<span className="notification-dot" />
            </button>
            <div className="topbar-avatar">DK</div>
          </div>
        </header>

        <div className="page-container">
          {loadingTransactions && (
           <div role="status">Loading transactions from backend...</div>
          )}

          {transactionError && (
            <div role="alert">{transactionError}</div>
          )}
          {activePage === 'Settings' ? (
            <SettingsPage />
          ) : activePage === 'AI Copilot' ? (
            <CopilotPage
              transaction={selectedTransaction}
              question={question}
              setQuestion={setQuestion}
              analysis={analysis}
              runAnalysis={runAnalysis}
              setActivePage={setActivePage}
            />
          ) : activePage === 'Recovery Center' ? (
            <RecoveryPage
              transactions={apiTransactions.filter(
                (transaction) =>
                  transaction.status === 'Needs review' ||
                  transaction.status === 'Action required',
              )}
              openCopilot={openCopilot}
            />
          ) : activePage === 'Transactions' ||
            activePage === 'Reconciliation' ? (
            <TransactionsPage
              title={activePage}
              transactions={filteredTransactions}
              search={search}
              setSearch={setSearch}
              setSelectedTransaction={setSelectedTransaction}
              openCopilot={openCopilot}
              showAll={showAll}
              setShowAll={setShowAll}
            />
          ) : (
            <OverviewPage
              transactions={visibleTransactions}
              search={search}
              setSearch={setSearch}
              setSelectedTransaction={setSelectedTransaction}
              openCopilot={openCopilot}
              showAll={showAll}
              setShowAll={setShowAll}
              setActivePage={setActivePage}
            />
          )}

          <footer className="page-footer">
            <span>PayFlow AI <span className="footer-separator">·</span> Payment operations intelligence</span>
            <span><span className="status-dot" /> Demo environment <span className="footer-separator">·</span> Sample data only</span>
          </footer>
        </div>
      </main>
    </div>
  )
}

function OverviewPage({
  transactions,
  search,
  setSearch,
  setSelectedTransaction,
  openCopilot,
  showAll,
  setShowAll,
  setActivePage,
}) {
  return (
    <>
      <section className="welcome-row">
        <div>
          <div className="eyebrow"><span className="eyebrow-line" /> PAYMENT OPERATIONS</div>
          <h1>Good morning, Merchant <span className="wave">✳</span></h1>
          <p className="page-description">
            Your payment operations at a glance. Let’s resolve what needs attention.
          </p>
        </div>
        <button className="primary-button" onClick={() => openCopilot()}>
          <span>✳</span> Ask AI Copilot <span className="button-arrow">↗</span>
        </button>
      </section>

      <section className="insight-banner">
        <div className="insight-icon">✳</div>
        <div className="insight-copy">
          <div className="insight-title">
            Your operations briefing <span className="ai-label">AI INSIGHT</span>
          </div>
          <p>
            Two sample payment exceptions need review. Verify their payment
            states before attempting any recovery action.
          </p>
        </div>
        <button
          className="text-button"
          onClick={() => setActivePage('Recovery Center')}
        >
          Review issues <span>→</span>
        </button>
      </section>

      <section className="metrics-grid">
        <MetricCard
          label="Total payment volume"
          value="$12,840.50"
          note="Illustrative sample value"
          icon="↗"
          tone="blue"
        />
        <MetricCard
          label="Completed payments"
          value="124"
          note="Sample completed records"
          icon="✓"
          tone="green"
        />
        <MetricCard
          label="Needs attention"
          value="02"
          note="Sample exceptions"
          icon="!"
          tone="amber"
        />
        <MetricCard
          label="Reconciliation rate"
          value="96.8%"
          note="Illustrative sample metric"
          icon="⟳"
          tone="purple"
        />
      </section>

      <section className="content-grid">
        <div className="panel transactions-panel">
          <div className="panel-header">
            <div>
              <h2>Recent transactions</h2>
              <p>Monitor payment activity and operational exceptions.</p>
            </div>
            <button
              className="subtle-button"
              onClick={() => setActivePage('Transactions')}
            >
              View all <span>→</span>
            </button>
          </div>

          <div className="table-toolbar">
            <div className="search-box">
              <span>⌕</span>
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search transactions..."
                aria-label="Search transactions"
              />
            </div>
            <span className="table-count">{transactions.length} shown</span>
          </div>

          <TransactionTable
            transactions={transactions}
            setSelectedTransaction={setSelectedTransaction}
            openCopilot={openCopilot}
          />

          <div className="table-footer">
            <span>Sample records for interface preview</span>
            <button className="text-button" onClick={() => setShowAll(!showAll)}>
              {showAll ? 'Show less' : 'Show more'} <span>→</span>
            </button>
          </div>
        </div>

        <aside className="copilot-card">
          <div className="copilot-card-top">
            <div className="copilot-icon">✳</div>
            <span className="online-label"><span /> READY</span>
          </div>
          <div className="copilot-kicker">YOUR PAYMENT ASSISTANT</div>
          <h2>Meet your AI Copilot</h2>
          <p>
            Understand payment exceptions, reconcile orders, and discover the
            next best action — with clear explanations.
          </p>

          <div className="suggestion-list">
            <button onClick={() => openCopilot()}>
              <span className="suggestion-icon">⌕</span>
              Why does a payment need review?
              <span className="suggestion-arrow">↗</span>
            </button>
            <button
              onClick={() =>
                openCopilot(
                  transactions.find((transaction) => transaction.status === 'Action required'),
                )
              }
            >
              <span className="suggestion-icon">⟳</span>
              Explain an order mismatch
              <span className="suggestion-arrow">↗</span>
            </button>
            <button onClick={() => setActivePage('Reconciliation')}>
              <span className="suggestion-icon">≋</span>
              Review reconciliation
              <span className="suggestion-arrow">↗</span>
            </button>
          </div>

          <button className="copilot-launch" onClick={() => openCopilot()}>
            Open AI Copilot <span>↗</span>
          </button>
          <div className="copilot-disclaimer">Demo interface · AI service not connected yet</div>
        </aside>
      </section>

      <section className="bottom-note">
        <span className="note-icon">i</span>
        <p>
          <strong>Demo data:</strong> All transaction names, amounts, and
          operational metrics shown here are illustrative. This dashboard is
          not yet connected to PayPal or a live AI service.
        </p>
      </section>
    </>
  )
}

function MetricCard({ label, value, note, icon, tone }) {
  return (
    <article className="metric-card">
      <div className="metric-top">
        <span className="metric-label">{label}</span>
        <span className={`metric-icon ${tone}`}>{icon}</span>
      </div>
      <div className="metric-value">{value}</div>
      <div className="metric-note">{note}</div>
    </article>
  )
}

function TransactionTable({
  transactions,
  setSelectedTransaction,
  openCopilot,
}) {
  if (!transactions.length) {
    return <div className="empty-state">No matching sample transactions found.</div>
  }

  return (
    <div className="table-scroll">
      <table className="transactions-table">
        <thead>
          <tr>
            <th>ORDER / REFERENCE</th>
            <th>TRANSACTION</th>
            <th>AMOUNT</th>
            <th>STATUS</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction) => (
            <tr key={transaction.id}>
              <td>
                <div className="order-cell">
                  <span className="customer-avatar">{transaction.initials}</span>
                  <span>
                    <strong>{transaction.merchantOrder}</strong>
                    <small>{transaction.id}</small>
                  </span>
                </div>
              </td>
              <td>
                <strong className="transaction-customer">{transaction.customer}</strong>
                <small className="transaction-type">{transaction.type}</small>
              </td>
              <td className="amount-cell">{transaction.amount}</td>
              <td><StatusBadge status={transaction.status} /></td>
              <td>
                <button
                  className="row-action"
                  title="Investigate with AI"
                  aria-label={`Investigate ${transaction.merchantOrder}`}
                  onClick={() => {
                    setSelectedTransaction(transaction)
                    openCopilot(transaction)
                  }}
                >
                  ↗
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StatusBadge({ status }) {
  const className = status.toLowerCase().replaceAll(' ', '-')
  return <span className={`status-badge ${className}`}>{status}</span>
}

function TransactionsPage({
  title,
  transactions,
  search,
  setSearch,
  setSelectedTransaction,
  openCopilot,
  showAll,
  setShowAll,
}) {
  const rows = title === 'Reconciliation'
    ? transactions.filter((transaction) => transaction.status !== 'Completed')
    : transactions

  return (
    <>
      <section className="welcome-row simple-welcome">
        <div>
          <div className="eyebrow"><span className="eyebrow-line" /> PAYMENT OPERATIONS</div>
          <h1>{title}</h1>
          <p className="page-description">
            {title === 'Reconciliation'
              ? 'Review sample order and payment exceptions requiring verification.'
              : 'Search and investigate payment operation records.'}
          </p>
        </div>
        <div className="sample-pill">DEMO DATA</div>
      </section>

      <section className="panel full-table-panel">
        <div className="panel-header">
          <div>
            <h2>{title === 'Reconciliation' ? 'Exceptions to investigate' : 'All transactions'}</h2>
            <p>Sample records · No live PayPal data connected</p>
          </div>
          <span className="table-count">{rows.length} records</span>
        </div>
        <div className="table-toolbar">
          <div className="search-box">
            <span>⌕</span>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by order, reference, or status..."
              aria-label="Search records"
            />
          </div>
        </div>
        <TransactionTable
          transactions={showAll ? rows : rows.slice(0, 4)}
          setSelectedTransaction={setSelectedTransaction}
          openCopilot={openCopilot}
        />
        {rows.length > 4 && (
          <div className="table-footer">
            <span>Showing {showAll ? rows.length : Math.min(rows.length, 4)} of {rows.length}</span>
            <button className="text-button" onClick={() => setShowAll(!showAll)}>
              {showAll ? 'Show less' : 'Show all'} →
            </button>
          </div>
        )}
      </section>
    </>
  )
}

function CopilotPage({
  transaction,
  question,
  setQuestion,
  analysis,
  runAnalysis,
  setActivePage,
}) {
  const [selectedPrompt, setSelectedPrompt] = useState(
    'Explain this payment exception',
  )

  return (
    <>
      <section className="welcome-row simple-welcome">
        <div>
          <div className="eyebrow"><span className="eyebrow-line" /> INTELLIGENT OPERATIONS</div>
          <h1>AI Payment Copilot <span className="wave">✳</span></h1>
          <p className="page-description">
            Understand the issue before deciding what to do next.
          </p>
        </div>
        <div className="sample-pill">DEMO MODE</div>
      </section>

      <section className="copilot-workspace">
        <div className="panel copilot-conversation">
          <div className="conversation-header">
            <div className="copilot-icon">✳</div>
            <div>
              <h2>Payment operations assistant</h2>
              <p><span className="status-dot" /> Demo interface · AI not connected</p>
            </div>
          </div>

          <div className="conversation-body">
            <div className="assistant-message">
              <div className="assistant-avatar">✳</div>
              <div className="message-content">
                <span className="message-author">PayFlow Assistant <span>DEMO</span></span>
                <p>
                  Hi! I can help you understand payment exceptions, reconcile
                  order records, and identify safe next steps.
                </p>
                <p>
                  Choose a sample transaction or ask a question. This preview
                  uses illustrative data; it does not verify real payments.
                </p>
              </div>
            </div>

            <div className="selected-transaction-card">
              <div className="selected-transaction-heading">
                <span>SELECTED SAMPLE TRANSACTION</span>
                <StatusBadge status={transaction.status} />
              </div>
              <div className="selected-order">{transaction.merchantOrder}</div>
              <div className="selected-details">
                <span>{transaction.customer}</span>
                <strong>{transaction.amount}</strong>
              </div>
              <div className="selected-reference">{transaction.id} · {transaction.type}</div>
            </div>

            {analysis && (
              <div className="assistant-message analysis-message">
                <div className="assistant-avatar">✳</div>
                <div className="message-content">
                  <span className="message-author">Demo analysis <span>ILLUSTRATIVE</span></span>
                  <p><strong>Issue:</strong> {transaction.status} — {transaction.type}.</p>
                  <p>
                    <strong>Recommended next step:</strong> Retrieve the current
                    payment state from the trusted PayPal backend and match its
                    order reference with your application record.
                  </p>
                  <p>
                    Do not mark this transaction as completed, retry a payment,
                    or initiate a refund based on this demo analysis alone.
                  </p>
                  <div className="analysis-footnote">
                    This is a predefined demonstration response, not an actual AI-generated
                    result or a verified PayPal payment status.
                  </div>
                </div>
              </div>
            )}

            <div className="prompt-label">SUGGESTED QUESTIONS</div>
            <div className="prompt-chips">
              {[
                'Explain this payment exception',
                'What should I verify next?',
                'How do I avoid duplicate processing?',
              ].map((prompt) => (
                <button
                  key={prompt}
                  className={selectedPrompt === prompt ? 'selected' : ''}
                  onClick={() => setSelectedPrompt(prompt)}
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>

          <form
            className="copilot-input-area"
            onSubmit={(event) => {
              event.preventDefault()
              runAnalysis()
            }}
          >
            <input
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask about this payment exception..."
              aria-label="Ask the payment copilot"
            />
            <button type="submit" className="send-button" aria-label="Submit question">↑</button>
          </form>
          <div className="input-disclaimer">
            Demo only. Do not enter passwords, payment credentials, or sensitive customer data.
          </div>
        </div>

        <aside className="panel copilot-context">
          <div className="context-heading">
            <span className="context-heading-icon">◎</span>
            <div><h3>Investigation context</h3><p>Sample record details</p></div>
          </div>
          <div className="context-item">
            <span>Order reference</span><strong>{transaction.merchantOrder}</strong>
          </div>
          <div className="context-item">
            <span>Record reference</span><strong>{transaction.id}</strong>
          </div>
          <div className="context-item">
            <span>Current sample status</span><StatusBadge status={transaction.status} />
          </div>
          <div className="context-item">
            <span>Record type</span><strong>{transaction.type}</strong>
          </div>

          <div className="context-divider" />
          <h3 className="next-step-title">Safe investigation checklist</h3>
          <div className="checklist-item"><span>1</span> Verify the payment using the backend.</div>
          <div className="checklist-item"><span>2</span> Match the correct order reference.</div>
          <div className="checklist-item"><span>3</span> Review the verified outcome before acting.</div>

          <button
            className="secondary-button context-button"
            onClick={() => setActivePage('Reconciliation')}
          >
            Open reconciliation <span>→</span>
          </button>
          <div className="context-disclaimer">Sample data only · No payment action is executed</div>
        </aside>
      </section>
    </>
  )
}

function RecoveryPage({ transactions, openCopilot }) {
  return (
    <>
      <section className="welcome-row simple-welcome">
        <div>
          <div className="eyebrow"><span className="eyebrow-line" /> PAYMENT OPERATIONS</div>
          <h1>Recovery Center</h1>
          <p className="page-description">Review sample exceptions and investigate before taking action.</p>
        </div>
        <div className="sample-pill">DEMO DATA</div>
      </section>

      <div className="recovery-notice">
        <span>!</span>
        <div>
          <strong>Verification required before recovery</strong>
          <p>These are illustrative exceptions. No retry, refund, or payment mutation will be performed by this demo.</p>
        </div>
      </div>

      <section className="recovery-grid">
        {transactions.length ? transactions.map((transaction) => (
          <article className="panel recovery-card" key={transaction.id}>
            <div className="recovery-card-top">
              <span className="recovery-symbol">↗</span>
              <StatusBadge status={transaction.status} />
            </div>
            <span className="recovery-type">{transaction.type}</span>
            <h2>{transaction.merchantOrder}</h2>
            <p>{transaction.customer} <span>·</span> {transaction.amount}</p>
            <div className="recovery-card-footer">
              <span>Review recommended</span>
              <button className="subtle-button" onClick={() => openCopilot(transaction)}>
                Investigate <span>↗</span>
              </button>
            </div>
          </article>
        )) : (
          <div className="empty-state">No sample exceptions available.</div>
        )}
      </section>
    </>
  )
}

function SettingsPage() {
  return (
    <>
      <section className="welcome-row simple-welcome">
        <div>
          <div className="eyebrow"><span className="eyebrow-line" /> CONFIGURATION</div>
          <h1>Settings</h1>
          <p className="page-description">Review the current demo configuration.</p>
        </div>
        <div className="sample-pill">LOCAL PREVIEW</div>
      </section>

      <section className="panel settings-panel">
        <div className="panel-header">
          <div><h2>Environment configuration</h2><p>Current local development status</p></div>
        </div>
        <div className="setting-row">
          <div><strong>Application environment</strong><p>Local development</p></div>
          <span className="setting-value">Frontend preview</span>
        </div>
        <div className="setting-row">
          <div><strong>PayPal connection</strong><p>No credentials or payment API connection configured</p></div>
          <span className="setting-pending">Not connected</span>
        </div>
        <div className="setting-row">
          <div><strong>AI service</strong><p>AI backend integration has not been implemented</p></div>
          <span className="setting-pending">Not connected</span>
        </div>
        <div className="setting-row">
          <div><strong>Database</strong><p>MySQL server exists; application database is not configured yet</p></div>
          <span className="setting-pending">Pending</span>
        </div>
        <div className="settings-notice">
          This page describes the development preview. It does not test or confirm any external service connection.
        </div>
      </section>
    </>
  )
}

export default App
