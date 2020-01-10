---
abstract: |
  This document describes low level specification for SKALE blockchain
  (schain) and SKALE consensus protocol.
author:
- SKALE Labs
title: SKALE Blockchain Low Level Specification
---

# SKALE Consensus

## Definitions and assumptions

### Schain

Schain is a fixed set of network nodes that accept user transactions,
run SKALE consensus and store identical copies of SKALE blockchain. A
typical implementation will run a network node in a virtualization
container such as a Docker container, so a single physical server can
provide support to multiple schains.

### Network security assumptions

SKALE consensus protocol assumes that the network is
asynchronous with eventual delivery guarantee, meaning that each nodes
are assumed to be connected by a reliable communications link. Links can
can be arbitrarily slow, but will eventually deliver messages.

The asynchronous model described above is similar to Bitcoin and
Ethereum blockchains. It reflects the state of modern Internet, where
temporary network splits are normal, but always resolve eventually.

The eventual delivery guarantee is achieved in practice by the sending
node making multiple attempts to transfer the message to the receiving
node, until the transfer is successful and is confirmed by the receiving
node.

Each sending node maintains a separate outgoing message queue for each
receiving node. To schedule a message for delivery to a particular node,
it is placed into the corresponding outgoing queue.

Each outgoing queue is serviced by a separate program thread. The thread
reads messages from the queue and attempts to transfer them to the
destination node. If the destination node temporarily does not accept
messages, the thread will keep initiating transfer attempts until the
message is delivered. The destination node can, therefore, temporarily
go offline without causing messages to be lost.

Since there is a dedicated message sending thread for each destination
node, messages are sent independently. Failure of a particular node to
accept messages will not affect receipt of messages by other nodes.

Independent delivery of messages can alternatively be achieved by a
nonblocking IO model, where the sending process sends messages in turns
to all destinations without waiting for messages to be confirmed.

In the remainder of this document, anywhere where it is specified that a
message is sent from node $A$ to $B$, we mean reliable independent
delivery as described above.

### Node security assumptions

We assume that the total number of nodes in the network is fixed and
equal to $N$. We also assume that out of $N$ nodes, $t$ nodes are
Byzantine (malicious), where

$$
3  t  + 1 <= N
$$

### Consensus state

Each node stores _consensus state_. For each round of consensus,
consensus state includes the set of proposed blocks, as well as the
state variables of the protocols used by the consensus round.

The state is stored in non-volatile memory and preserved across reboots.

### Reboots and crashes

During a , a node will temporarily become unavailable. After a reboot,
messages destined to the node will be delivered to the node. Therefore,
a reboot does not disrupt operation of asynchronous consensus.

Since consensus protocol state is not lost during a reboot, a node
reboot will be interpreted by its peers as a temporarily slowdown of
network links connected to the node.

A is an event, where a node loses all of parts of the consensus state.
For instance, a node can lose received block proposals or values of
protocol variables.

A hard crash can happen in case of a software bug or a hardware failure.
It also can happen if a node stays offline for a very long time. In this
case, the outgoing message queues of nodes sending messages to this node
will overflow, and the nodes will start dropping older messages. This
will lead to a loss of a protocol state.

### Default queue lifetime

This specification specifies one hour as a default lifetime of a message
which has been placed into an outgoing queue. Messages older than one
hour may be dropped from the message queues. A reboot, which took less
than an hour is, therefore, guaranteed to be a a normal reboot.

### Limited hard crashes

Hard crashes are permitted by the consensus protocol, as long as not too
many nodes crash at the same time. Since a crashed node does not conform
to the consensus protocol, it counts as a Byzantine node for the
consensus round, in which the state was lost. Therefore, only a limited
number of concurrent hard crashes can exist at a given moment in time.
The sum of crashed nodes and byzantine nodes can not be more than $t$ in
the equation (1). Then the crash is qualified as a limited hard crash.

During a limited hard crash, other nodes continue block generation and
consensus. The blockchain continues to grow. When a crashed node is back
online, it will sync its blockchain with other nodes using a catchup
procedure described in this document, and start participating in
consensus.

### Widespread crashes

A widespread crash is a crash where the sum of crashed nodes and
Byzantine nodes is more than $t$.

During a _widespread crash_ a large proportion of nodes or all nodes may
lose the state for a particular round and consensus progress may stall.
The blockchain, therefore, may lose its liveliness.

Security of the blockchain will be preserved, since adding a new block
to blockchain requires a supermajority threshold signature of nodes, as
described later in this document.

The simplest example of a widespread crash is when more than 1/3 of
nodes are powered off. In this case, consensus will stall. When the
nodes are back online, consensus will start working again.

In real life, a widespread crash can happen due to to a software bug
affecting a large proportion of nodes. As an example, after a software
update all nodes in an schain may experience the same bug.

### Failure resolution protocol

In a case of a catastrophic failure a separate failure resolution
protocol is used to restart consensus.

First, nodes will detect a catastrophic failure by detecting absence of
new block commits for a long time.

Second, nodes will execute a failure recovery protocol that utilizes
Ethereum main chain for coordination. Each node will stop consensus
operation. The nodes will then sync their blockchains replicas, and
agree on time to restart consensus.

Finally, after a period of mandatory silence, nodes will start consensus
at an agreed time point in the future.

### Blockchain architecture

Each node stores a sequence of blocks. Blocks are constructed from
transactions submitted by users.

The following properties are guaranteed:

1.  _block sequence_ - each node stores a block sequence $B[i]$ that
    have positive block IDs ranging from 0 to $HEAD$

2.  _genesis block_ - every node has the same genesis block that has
    zero block id.

3.  _liveliness_ - the blockchain on each node will continuously grow by
    appending newly committed blocks. If users do not submit
    transactions to the blockchain, empty blocks will be periodically
    committed. Periodic generation of empty blocks serves as a beacon to
    monitor liveliness of the blockchain.

4.  _fork-free consistency_ - due to network propagation delays,
    blockchain lengths on two nodes $A$ and $B$ may be different. For a
    given block id, if both node $A$ and node $B$ possess a copy of a
    block, the two copies are guaranteed to be identical.

### Honest and Byzantine Nodes

An honest node is a node that behaves according to the rules described
in this document. A Byzantine node can behave in arbitrary way,
including doing nothing at all.

The goal of a Byzantine node is to either violate the liveliness
property of the protocol by preventing the blockchain from committing
new blocks or violate the consistency property of the protocol by making
two different nodes commit two different blocks having the same block
ID.

It is assumed that out of $N$ total nodes, $t$ nodes are Byzantine,
where less the following condition is satisfied.

$$
3  t  + 1 <= N
$$

or

$$
t <= floor((N - 1)/3)
$$

The above condition is well known in the consensus theory. There is a
proof that shows that secure asynchronous consensus is impossible for
larger values of $t$.

It is easy to show that if a security proof works for a certain number
of Byzantine nodes, it will work for a fewer Byzantine nodes. Indeed, an
honest node can always be viewed as a Byzantine node that decided to
behave honestly. Therefore, in proofs, we always assume that the system
has the maximum allowed number of Byzantine nodes

$$
t =  floor((N - 1)/3)
$$

In this case the number of honest nodes is

$$
h = N-t = N - floor((N - 1) / 3) = floor((2 N + 1) / 3
$$

Note, that it is beneficial to select $N$ in such a way that $(N-1)/3$
is divisible by $3$. Otherwise an increase in $N$ does not lead to an
increase in the maximum allowed number of Byzantine nodes.

As an example, for $N = 16$ we get $t = 5$. For $N = 17$ we get $t = 5$
too, so an increase in $N$ does not improve Byzantine tolerance.

In this specification, we assume that the $N$ is always selected in such
a way that $N - 1$ is divisible by 3.

In this case, expressions simplify as follows

$$
t = (N - 1) / 3
$$

$$
h = (2 N + 1) / 3 = 2 t + 1
$$

### Mathematical properties of node voting

Consensus uses voting rounds. It is, therefore, important to proof some
basic mathematical properties of voting.

Typically, a node will vote by signing a value and transmitting it to
other nodes. To count votes, a receiving node will count received
signatures for a particular value $v$.

The number of Byzantine nodes is less than a simple majority of honest
nodes.

This directly follows from the fact that $h = 2t + 1$, and, therefore, a
simple majority of honest nodes is

$$
s = t + 1
$$

We define _supermajority_ as a vote of at least $(2 N + 1) / 3$ nodes.

_A vote of all honest nodes is a supermajority_.

Proof: this comes from the fact that $h = (2 N + 1) / 3$.

If a particular message was signed by a supermajority vote, at least a
simple majority of honest nodes signed this message

Even if all Byzantine nodes participate in a supermajority vote, the
number of honest votes it needs to receive is

$$
(2 N + 1) / 3 - t = 2 t + 1 - t =  t + 1
$$

which is exactly the simple majority of honest nodes $s$.

If honest nodes are required to never sign conflicting messages, two
conflicting messages can not be signed by a supermajority vote.

Proof: lets $A$ and $B$ be two conflicting messages. Since a particular
honest node will sign either $A$ or $B$, both $A$ and $B$ can not get
simple majority of honest nodes. Since a supermajority vote requires
participation of a simple majority of honest nodes, both $A$ and $B$ can
not reach a supermajority, even if Byzantine nodes vote for both.

A supermajority vote, is, therefore, an important conflict avoidance
mechanism. If a message is signed by a supermajority vote, it is
guaranteed that no conflicting messages exist. As an example, if a block
is signed by a supermajority vote, it is guaranteed that no other block
with the same block ID exists.

### Threshold signatures

Our protocol uses threshold signatures for supermajority voting.

Each node is supposed to be in possession of BLS private key share
$PKS[I]$. Initial generation of key shares is performed using
joint-Feldman Distributed Key Generation (DKG) algorithm that is
described in this document. DKG algorithm is executed when an schain is
created.

Nodes are able to collectively issue supermajority threshold signatures
on messages, where the threshold value is equal to the supermajority
vote $(2 N + 1) / 3$. For instance for $N = 16$, the threshold value is
$11$.

BLS threshold signatures are implemented as described in the paper of by
Boldyreva. BLS threshold signatures require a choice of elliptic curve
and group pairing. We use elliptic curve (altBN256) and group pairing
(optimal-Ate) implemented in Ethereum Constantinople release.

To verify the signature, one uses BLS public key $PK$. This key is
computed during the initial DKG algorithm execution. The key is stored
in SKALE manager contract on the main ETH net, and is available to
anyone.

### Transactions

Each user transaction $T$ is assumed to be an Ethereum-compatible
transaction, represented as a sequence of bytes.

### Block format: header and body

Each block is a byte string, which includes a header followed by a body.

### Block format: header

Block header is a JSON object that includes the following:

1.  $BLOCK\ ID$ - integer id of the current block, starting from 0 and
    incremented by 1

2.  $BLOCK\ PROPOSER$ - integer id of the node that proposed the block.

3.  $PREVIOUS\ BLOCK\ HASH$ - sha-3 hash of the previous block

4.  $CURRENT\ BLOCK\ HASH$ - the hash of the current block

5.  $TRANSACTION\ COUNT$ - count of transactions in the current block

6.  $TRANSACTION\ SIZES$ - an array of transaction sizes in the current
    block

7.  $CURRENT\ BLOCK\ PROPOSER\ SIG$ - ECDSA signature of the proposer of
    the current block

8.  $CURRENT\ BLOCK\ TSIG$ - BLS supermajority threshold signature of
    the current block

Note: All integers in this spec are unsigned 64-bit integers unless
specified otherwise.

### Block format: body

$BLOCK\ BODY$ is a concatenated transactions array of all transactions
in the block.

### Block format: hash

Block hash is calculated by taking 256-bit Keccack hash of block header
concatenated with block body, while omitting $CURRENT\ BLOCK\ HASH$,
$CURRENT\ BLOCK\ SIG$, and $CURRENT\ BLOCK\ TSIG$ from the header. The
reason why these fields are omitted is because they are not known at the
time block is hashed and signed.

Note: Throughout this spec we use SHA-3 as a secure hash algorithm.

### Block verification

A node or a third party can verify the block by verifying a threshold
signature on it and also verifying the previous block hash stored in the
block. Since the threshold signature is a supermajority threshold
signature and since any honest node will only sign a single block at a
particular block ID, no two blocks with the same block ID can get a
threshold signature. This provides security against forks.

### Block proposal format

A block starts as a block proposal. A block proposal has the same
structure as a block, but has the threshold signature element unset.

Node concurrently make proposals for a given block ID. A node can only
make one block proposal for a given block ID.

Once a block proposal is selected to become a block by consensus, it is
signed by a supermajority of nodes. A signed proposal is then committed
to the end of the chain on each node.

### Pending transactions queue

Each node will keep a pending transactions queue. The first node that
receives a transaction will attempt to propagate it to all other nodes
in the queue. A user client software may also directly submit the
transaction to all nodes.

When a node commits a block to its blockchain, if will remove the
matching transactions from the transaction queue.

### Gas fees

Each transaction requires payment of a gas fee, compatible with ETH gas
fee. The gas fee can be paid in native currency of the schain or in
Proof of Work. The gas price is adjusted after each committed block. It
is decreased if the block has been underloaded, meaning that the number
of transactions in the block is less than 70 percent of the maximum
number of transactions per block, and is decreased if the block has been
underloaded.

### Compressed block proposal communication

Typically pending queues of all nodes will have similar sets of
messages, with small differences due to network propagation times.

When node $A$ needs to send to node $B$ a block proposal $P$, $A$ does
need the send the actual transactions that compose $P$. $A$ only needs
to send transaction hashes, and then $B$ will reconstruct the proposal
from hashes by matching hashes to messages in its pending queue.

In particular, for each transaction hash in the block proposal, the
receiving node will match the hash to a transaction in its pending
queue. Then, for transactions not found in the pending queue, the
receiving node will send a request to the sending node. The sending node
will then send the bodies of these transactions to the receiving node.
After that the receiving node will then reconstruct the block proposal.

## Consensus data structures and operation

### Blockchain

For a particular node, the blockchain consists of a range of committed
blocks $B[i]$ starting from $B[0]$ end ending with $B[TIP\_ID]$, where
$TIP\ ID$ is the ID of the largest known committed block. Block ids are
sequential positive integers. Blocks are stored in non-volatile storage.

### Consensus rounds

New blocks a created by running consensus rounds. Each round corresponds
to a particular $BLOCK\ ID$.

At the beginning of a consensus round, each node makes a block proposal.

When a consensus round completes for a particular block, one of block
proposals wins and is signed using a supermajority signature, becoming a
committed block.

Due to a randomized nature of consensus, the is a small probability that
consensus will agree on an empty block instead of agreeing on any of the
proposed blocks. In this case, an empty block is pre-committed to a
blockchain.

### Catchup agent

There are two ways, in which blockchain on a particular node grows and
$TIP\ ID$ is incremented:

Normal consensus operation: during normal consensus, a node constantly
participates in consensus rounds, making block proposals and then
committing the block after the consensus round commits.

Catchup: a separate catchup agent is continuously running on a node. The
catchup engine is continuously making random sync connections to other
nodes. During a sync both nodes sync their blockchains and block
proposal databases.

If during catchup, node $A$ discovers that node $B$ has a larger value
of $TIP\ ID$, $A$ will download the missing blocks range from $B$, and
commit it to its chain after verifying supermajority threshold
signatures on the received blocks.

Note that both normal and catchup operation append blocks to the
blockchain. The catchup procedure intended to catchup after hard
crashes.

When the node comes online from a hard crash, it will immediately start
participating in the consensus for new blocks by accepting block
proposals and voting according to consensus mechanism, but without
issuing its own block proposals. Since a block proposal requires hash of
the previous block, a node will only issue its own block proposal for a
particular block id once it a catch up procedure moves the $TIP\ ID$ to
a given block id.

Liveliness property is guaranteed under hard crashes if the following is
true: normal consensus guarantees liveliness properly, catch-up
algorithm guarantees eventual catchup, and if the number of nodes in a
hard crashed state at a given time plus the number of Byzantine nodes is
less or equal $N-1/3$.

Since the normal consensus algorithm is resilient to having $(N-1)/3$
Byzantine nodes, normal consensus will still proceed if we count crashed
nodes as Byzantine nodes and guarantee that the total number of
Byzantine nodes is less than $(N-1)/3$. When a node that crashed joins
the system back, it will immediately start participating in the new
consensus rounds. For the consensus rounds that it missed, it will use
the catchup procedure to download blocks from other nodes.

## Normal consensus operation

### Block proposal creation trigger

A node is required to create a block proposal directly after its
$TIP\ ID$ moves to a new value. $TIP\ ID$ will be incremented by $1$
once a previous consensus round completes. $TIP\ ID$ will also move, if
the catchup agent appends blocks to the blockchain.

### Block proposal creation algorithm

To create a block a node will:

1.  examine its pending queue,

2.  if the total size of of transactions in the pending queue
    $TOTAL\ SIZE$ is less or equal than $MAX\ BLOCK\ SIZE$, fill in a
    block proposal by taking all transactions from the queue,

3.  otherwise, fill in a block proposal by of $MAX\ BLOCK\ SIZE$ by
    taking transactions from oldest received to newest received,

4.  assemble transactions into a block proposal, ordering transactions
    by sha-3 hash from smallest value to largest value,

5.  in case the pending queue is empty, the node will wait for
    $BEACON\ TIME$ and then, if the queue is still empty, make an empty
    block proposal containing no transactions.

Note that the node does not remove transactions from the pending queue
at the time of proposal. The reason for this is that at the proposal
time there is no guarantee that the proposal will be accepted.

$MAX\ BLOCK\ SIZE$ is the maximum size of the block body in bytes.
Currently we use $MAX\ BLOCK\ SIZE = 8 MB$. FUTURE: We may consider
self-adjusting block size to target a particular average block commit
time, such as $1s$.

$BEACON\ TIME$ is time between empty block creation. If no-one is
submitting transactions to the blockchain, empty beacon blocks will be
created. Beacon blocks are used to detect normal operation of the
blockchain. The current value of $BEACON\ TIME$ is $3s$.

### Block proposal reliable communication algorithm

Once a node creates a block proposal it will communicate it to other
nodes using the data data availability protocol described below.

The data availability protocol guarantees that if the the protocol
completes successfully, the message is transferred to the supermajority
of nodes.

The five-step protocol is described below:

1.  Step 1: the sending node $A$ sends the proposal $P$ to all of its
    peers

2.  Step 2: each peer on receipt of $P$ adds the proposal to its
    proposal storage database $PD$

3.  Step 3: the peer than sends a receipt to back to $S$ that contains a
    threshold signature share for $P$

4.  Step 4: $A$ will wait until it collects signature shares from a
    $supermajority$ of nodes (including itself) $A$ will then create a
    supermajority signature $S$. This signature serves as a receipt that
    a supermajority of nodes are in possession of $P$

5.  Step 5: $A$ will send the supermajority signature to each of the
    nodes.

_Data Availability Receipt Requirement_ In further consensus steps, any
node voting for proposal $P$ is required to include $S$ in the vote.
Honest nodes will ignore all votes that do not include the supermajority
signature $S$.

The protocol used above guarantees data availability, meaning that any
proposal $P$ that wins consensus will be available to any honest nodes.
This is proven in steps below.

Liveliness. If $A$ is honest, than the five-step protocol above will
always complete. By completion of the protocol we mean that all honest
nodes will receive $S$. Byzantine nodes will not be able to stall the
protocol.

By properties of the send operation discussed in Section 1.2 all sends
in Step 1-3 are performed in parallel. In step 4 node $A$ waits to
receive signature shares for the supermajority of nodes. This step will
always take fine time, even if Byzantine nodes do not reply. This comes
from the fact that there is a supermajority of honest nodes. In step 5
$S$ will be added to outgoing message queues of all nodes. Since honest
nodes do accept messages, $S$ will ultimately be delivered to all honest
nodes as described in Section 1.2.

If a proposal has a supermajority signature, it is was communicated to
and stored on the simple majority of honest nodes.

The proof directly follows from Lemma 3, and from the fact that an
honest node $B$ only signs the proposal after $B$ has received and
stored the proposal.

If a proposal wins consensus and is to be committed to the blockchain,
then any honest node $X$ that does not have the proposal can efficiently
retrieve it.

First, a proposal will not pass consensus without having a supermajority
signature. This comes from the fact that all nodes voting for the
proposal will need to include $S$ in the vote.

By the properties of binary Byzantine agreement protocol of Moustefaui
at al., a proposal can win consensus only if at least one honest node
votes for the proposal. A proposal without a signature will never win
consensus, since an honest node will never vote for it.

Therefore, if a proposal won consensus, it is guaranteed to have a
supermajority signature.

Second by previous lemma, if a proposal has a supermajority signature,
any honest node can retrieve it. This completes the proof.

The protocol discussed above is important because it guarantees that if
a proposal wins consensus, all honest nodes can get this proposal from
other honest nodes and add it to the blockchain.

### Pluggable Binary Byzantine Agreement

The consensus described above uses an Asynchronous Binary Byzantine
Agreement (ABBA) protocol (ABBA). We currently use ABBA from Moustefaoi
et. all. Any other ABBA protocol $P$ can be used, as long as it has the
following properties

1.  Network model: $P$ assumes asynchronous network messaging model
    described in Section 1.2

2.  Byzantine nodes: $P$ assumes less than one third of Byzantine nodes,
    as described by Equation (1).

3.  Initial vote: $P$ assumes, that each node makes an initial vote
    $yes(1)$ or $no(0))$

4.  Consensus vote: $P$ terminates with a consensus vote of either $yes$
    or $no$, where if the consensus vote is $yes$, its is guaranteed
    that at least one honest node voted yes.

Note that, an ABBA protocol typically outputs a random number
$COMMON\ COIN$ as a byproduct of its operation. We use this
$COMMON\ COIN$ as a random number source.

### Consensus round

A consensus round $R$ is executed for each $BLOCK\ ID$ and has the
following properties:

1.  For each $R$ nodes will execute $N$ instances of ABBA.

2.  Each $ABBA[i]$ corresponds to a vote on block proposal from the node
    $i$

3.  Each $ABBA[i]$ completes with a consensus vote of $yes$ or $no$

4.  Once all $ABBA[i]$ complete, there is a vote vector $v[i]$, which
    includes $yes$ or $no$ for each proposal.

5.  If there is only one $yes$ vote, the corresponding block proposal
    $P$ is committed to the blockchain

6.  If there are multiple $yes$ votes, $P$ is pseudorandomly picked from
    the $yes$-voted proposals using pseudo-random number $R$. The
    winning proposal index the remainder of division of $R$ by
    $n_{win}$, where $n_{win}$ is the total number of $yes$ proposals.

7.  The random number $R$ is the sum of all ABBA $COMMON\ COIN$s.

8.  In the rare case when all votes are $no$, an empty block is
    committed to the blockchain. The probability of an all-no vote is
    very small and decreases when $N$ increases. This is analyzed in
    detail in the following sections.

Liveliness: each consensus round $R$ will always produce a block in a
finite time.

The proof follows from the fact that each $R$ runs $N$ parallel versions
of $ABBA$ binary consensus, and from the liveliness property of the
$ABBA$ consensus

Consistency: each consensus round will produce the same result $P$ on
all nodes

This follows from the consistency property of the ABBA consensus and
from the fact that the consensus round algorithm is deterministic and
does not depend on the node where it is executed.

Data Availability: the winning proposal $P$ is available to any honest
node.

This follows from the fact, that ABBA will not return consensus $yes$
vote unless at least one honest node initially votes $yes$, and from the
fact that an honest node will not vote $yes$ unless it has a data
availability proof (threshold signature $S$).

## Consensus round vote trigger

Each node $A$ will vote for ABBAs in a consensus round $R$ immediately
after proposal phase completes, meaning that two processes complete:

1.  $A$ receives a supermajority of block proposals for this round,
    including data availability signatures

2.  $A$ transmits its block proposal to a supermajority of nodes

Liveliness: the block proposal phase will complete in finite time, and
the node will proceed with voting

Indeed, since a supermajority of nodes are honest, and since every
honest node sends its block proposal and data availability signature to
all other nodes, at some point in time $A$ will receive proposals and
data availability signatures from a supermajority of nodes.

Also, since a supermajority of destination nodes are honest, at some
point in time the node will transmit its block proposal to a
supermajority of nodes.

It will vote $yes$ for each block proposal that it received, and $no$
for each block proposal that it did not receive.

Vote of each honest node will include $(2 N + 1) / 3$ $yes$ votes and
$2 N - 1)/3$ $no$ votes

This simply follows from the fact, that node $A$ votes immediately after
receiving a supermajority of block proposals, and from the fact that $A$
votes yes for each block proposal that it received

## Finalizing Winning Block Proposal

Once consensus completes on a particular node $A$ and the winning block
proposal, the node will execute the following algorithm to finalize the
proposal and commit it to the chain.

1.  $A$ will check if it has received the winning proposal $P$

2.  if $A$ has not received the proposal, it will download it from its
    peer nodes using the algorithm described later in this document. It
    is possible to do it because of Lemma 11.

3.  $A$ will then sign a signature share for $P$ and send it to all
    other nodes

4.  $A$ will then wait to receive signature shares from a supermajority
    of nodes, including itself

5.  Once $A$ has received a supermajority of signature shares, it will
    combine them into a threshold signature.

6.  $A$ will then commit the $P$ to the blockchain together with the
    threshold signature of $P$

The proposal download algorithm is specified below. The proposal assumes
that the proposal is split in $N-1$ chunks of equal size
$Math.ceiling(size(P) / (N - 1))$, except the last chunk the size of
which will be the remainder of $size(P) / (N - 1)$

The purpose of the algorithm is to minimize network traffic.

1.  $A$ sends a message to each peer $i$ , requesting for chunk $i$

2.  $A$ waits until it receives a $supermajority - 1$ of responses

3.  $A$ then enumerates missing chunks

4.  $A$ then randomly assigns each missing chunk to a servers, and empty
    chunks to each server that did not get a missing chunk assigned ,
    and sends the corresponding requests to each server.

5.  $A$ waits until receives $supermajority -1$ of responses

6.  If $A$ received all chunks, the algorithm is complete. Otherwise it
    goes back to step 3.

FUTURE: we may implement more advanced algorithms based on erasure
codes.

### Purging old transactions

For each node, 33 percent of the storage is assigned to blockchain, 33
percent to EVM and 33 to the rest of the system, such as consensus
state.

If blockchain storage is exhausted, the old blocks will be deleted to
free storage in increments of 1024 blocks.

If EVM/Solidity storage is exhausted, EVM will start throwing
\\"OutOfStorage\\" errors until storage is freed.

If consensus storage is exhausted, the consensus agent will start
erasing items such as messages in the message outgoing queues, in the
order of item age, from oldest to newest.

## EVM/Solidity

### EVM compatibility

The goal is to provide EVM/Solidity compatibility, except the cases
documented in this specification. The compatibility is for client
software, in particular Metamask, Truffle, Web3js and Web3py.

### EVM execution

Once a block is finalized on the chain, it is passed to EVM, and each
transaction is sequentially executed by the EVM one after another. We
currently use unmodified Ethereum EVM, therefore there should not be
compatibility issues. Once Ethereum finalizes EWASM version of EVM, we
will be able to plug in in.

### EVM storage

EVM has pluggable storage backend database to store EVM/Solidity
variables we simplified and sped up the storage by using LevelDB from
Google. Each variable in EVM is stored as a key value in LevelDB where
the key is the sha3 hash of the virtual memory address and the value is
the 256 bit value of the variable. In EVM all variables have 256 bits.

### EVM gas calculations and DOS protection

We do not charge users gas for transactions.

We do have a protection against Denial of Service attacks.

Each transaction needs to submit proof of work (PoW) proportional to the
amount of gas that the transaction would have used if we would charge
for transactions. We are currently using the same PoW algorithm as
Ethereum.

$$
POW = k * GAS
$$

This PoW is calculated in the browser or other client that submits a
transaction and is passed together with the transaction. If the
transaction does not include the required PoW it will be rejected.

We are still researching the formula for $k$. Ideally $k$ should go down
if the chain is underloaded and increase if the chains starts to be
overloaded.

## Ethereum clients

### Compatibility

The goal is to provide compatible JSON client API for client software
such as Web3js, Web3py, Metamask and Truffle.

### FUTURE: Multi-node requests

Existing clients such Web3js connect to a single node, which creates
security problem for Solidity read requests that read variables.

Transactions involve a consensus of the entire blockchain, but Solidity
read requests interact with a single node. Therefore, an malicious node,
such as Infura, can prove a user incorrect information on, e.g. the
amount of funds the user has in possession.

Therefore, in the future we will need to add multi-node requests where
the first node that receives the request passes it to all others and
collects a tsig.
