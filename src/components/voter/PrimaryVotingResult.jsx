import React from 'react';
import { Accordion, Table } from 'react-bootstrap';

const PrimaryVotingResult = ({ data }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-center mb-6">Voting Results by Dzongkhag and Constituency</h1>

      <Accordion defaultActiveKey="0">
        {data.map((dzongkhag, dzIndex) => {
          // Compute total votes per party in this Dzongkhag
          const dzongkhagVotes = {};
          dzongkhag.constituencies.forEach(c => {
            c.results.forEach(r => {
              dzongkhagVotes[r.party] = (dzongkhagVotes[r.party] || 0) + r.votes;
            });
          });

          const sortedParties = Object.entries(dzongkhagVotes)
            .sort((a, b) => b[1] - a[1]);

          const totalVotes = Object.values(dzongkhagVotes).reduce((a, b) => a + b, 0);

          return (
            <Accordion.Item eventKey={String(dzIndex)} key={dzIndex}>
              <Accordion.Header>{dzongkhag.dzongkhag}</Accordion.Header>
              <Accordion.Body>
                <div className="mb-4">
                  <p className="text-sm text-gray-600">
                    <strong>Total Votes:</strong> {totalVotes}
                  </p>
                  <p className="text-sm text-green-600">
                    🏆 <strong>Leading Party:</strong> {sortedParties[0][0]} with {sortedParties[0][1]} votes
                  </p>
                </div>

                {dzongkhag.constituencies.map((constituency, cIndex) => {
                  const sortedResults = [...constituency.results].sort((a, b) => b.votes - a.votes);
                  const topVotes = sortedResults[0].votes;

                  return (
                    <div key={cIndex} className="mb-6">
                      <h2 className="text-lg font-semibold mb-2">{constituency.name}</h2>
                      <Table striped bordered hover responsive>
                        <thead>
                          <tr>
                            <th>#</th>
                            <th>Party</th>
                            <th>Votes</th>
                          </tr>
                        </thead>
                        <tbody>
                          {constituency.results.map((result, rIndex) => (
                            <tr
                              key={rIndex}
                              className={result.votes === topVotes ? 'bg-green-100 font-semibold' : ''}
                            >
                              <td>{rIndex + 1}</td>
                              <td>{result.party}</td>
                              <td>{result.votes}</td>
                            </tr>
                          ))}
                        </tbody>
                      </Table>
                    </div>
                  );
                })}
              </Accordion.Body>
            </Accordion.Item>
          );
        })}
      </Accordion>
    </div>
  );
};

export default PrimaryVotingResult;
