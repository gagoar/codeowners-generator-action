export const FILE_ENCODING = 'utf8';

interface Commit {
  sha: string;
}
interface Owner {
  login: string;
  id: number;
}
interface Repository {
  name: string;
  owner: Owner;
}
interface PullRequest {
  head: Commit;
  base: Commit;
  body: string;

  organization: string;
}
interface Checkrun {
  id: number;
}
export interface Event {
  action: string;
  number: number;
  pull_request: PullRequest;

  repository: Repository;
  check_run?: Checkrun;
}

export type Status = 'in_progress' | 'completed';
export type Conclusion = 'success' | 'failure';
